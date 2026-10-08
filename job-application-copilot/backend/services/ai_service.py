import os
import json
import re
import logging
from typing import Dict, Any, Optional
import httpx
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("copilot.ai_service")


class AIService:
    """Abstraction layer for LLM interactions with robust error handling and fallback support."""

    def __init__(self):
        self.api_key = os.getenv("LLM_API_KEY", "").strip()
        self.model = os.getenv("LLM_MODEL", "gpt-4o-mini").strip() or "gpt-4o-mini"
        self.base_url = os.getenv("LLM_BASE_URL", "").strip()

    def is_configured(self) -> bool:
        """Check if a real LLM API key has been provided."""
        if not self.api_key:
            return False
        if self.api_key in ["your_key_here", "your_model_name", "placeholder", "xxx"]:
            return False
        return True

    def _extract_json(self, text: str) -> Dict[str, Any]:
        """Safely extract JSON from LLM response text (handles markdown fences)."""
        text = text.strip()
        # Look for markdown code fence
        json_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
        if json_match:
            text = json_match.group(1).strip()
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # Fallback regex search for { ... }
            braces_match = re.search(r"\{[\s\S]*\}", text)
            if braces_match:
                return json.loads(braces_match.group(0))
            raise ValueError(f"Could not parse valid JSON from LLM response: {text[:200]}")

    async def call_llm(self, prompt: str, system_prompt: str = "You are an expert AI Career Copilot.", temperature: float = 0.2) -> str:
        """Call the LLM API. Supports OpenAI-compatible endpoints or Google Gemini."""
        if not self.is_configured():
            raise RuntimeError("LLM_API_KEY is not configured. Running in Demo / Fallback mode.")

        # Determine endpoint
        if self.base_url:
            endpoint = f"{self.base_url.rstrip('/')}/chat/completions"
        elif self.api_key.startswith("AIza"):
            # Google Gemini native REST endpoint
            endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
            payload = {
                "contents": [
                    {"role": "user", "parts": [{"text": f"{system_prompt}\n\n{prompt}"}]}
                ],
                "generationConfig": {"temperature": temperature}
            }
            async with httpx.AsyncClient(timeout=45.0) as client:
                res = await client.post(endpoint, json=payload)
                res.raise_for_status()
                data = res.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
        else:
            # Standard OpenAI or compatible provider
            endpoint = "https://api.openai.com/v1/chat/completions"

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            "temperature": temperature
        }

        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(endpoint, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]

    async def generate_json(self, prompt: str, system_prompt: str = "") -> Dict[str, Any]:
        """Generate structured JSON response using LLM."""
        full_system = (system_prompt + "\nRespond with valid JSON only. Do not include extra text outside the JSON object.").strip()
        raw_text = await self.call_llm(prompt, system_prompt=full_system, temperature=0.1)
        return self._extract_json(raw_text)


ai_service = AIService()
