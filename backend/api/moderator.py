import os
from openai import OpenAI
from dotenv import load_dotenv, find_dotenv




#load api key form env

_ = load_dotenv(find_dotenv())

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)
print(os.environ.get("OPENAI_API_KEY"))


def moderate_content(content):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a content moderation assistant. Please analyze the following text for any inappropriate or harmful content.",
                },
                {
                    "role": "user",
                    "content": content,
                },
            ],
            model="gpt-3.5-turbo",
        )


        moderation_result = chat_completion['choices'][0]['message']['content'].strip()

        return moderation_result
    
    except Exception as e:

        print(f"An error occurred during content moderation: {e}")
        return "An error occurred during content moderation. Please try again."
    
if __name__ == "__main__":
    sample_text = "Test content."
    result = moderate_content(sample_text)
    print("Moderation Result:", result)