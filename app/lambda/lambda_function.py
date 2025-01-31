import json
import base64
import os
from openai import OpenAI

def lambda_handler(event, context):
    # Create OpenAI client
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    event_body = event.get("body", "{}")
    if isinstance(event_body, str):
        event_body = json.loads(event_body)

    base64_image = event_body.get("image", "")

    if not base64_image:
        return {
            'statusCode': 400,
            'body': json.dumps('Missing base64 image data in event.')
        }

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text",
                            "text": (
                                "The image provided displays an article that has been uploaded for sale."
                                "Describe the article in simple words."
                                "Keep it short. "
                                "approximate the price, provide the price in pounds but return just the number"
                                "Topic should be the name of the item for example Blue Jeans"
                                "Return it in json format: topic : topic, price : price, description : description"
                            ),},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}},
                    ],
                }
            ],
        )

        message_content = response.choices[0].message.content
        lines = message_content.splitlines()

        lines = lines[1:-1]

        modified_content = "\n".join(lines)

        result = json.loads(modified_content)
        topic = result.get("topic", "Unknown")
        price = result.get("price", "Unknown")
        description = result.get("description", "Unknown")
        token_usage = response.usage.model_dump()

        return {
            'statusCode': 200,
            'body': json.dumps({
                "topic": topic,
                "price": price,
                "description": description,
                "token_usage": token_usage
            })
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error: {str(e)}')
        }

