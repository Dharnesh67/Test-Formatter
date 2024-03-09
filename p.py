import json
import requests
def ocr_space_file(filename, overlay=False, api_key='K86594455288957', language='eng'):
    """
    OCR.space API request with local file and text output storage, with enhanced error handling.

    :param filename: Your file path & name (supports images and PDFs).
    :param overlay: Is OCR.space overlay required in your response (default: False).
    :param api_key: Your OCR.space API key.
    :param language: Language code to be used in OCR (list available codes on https://ocr.space/OCRAPI).
    :return: None
    """

    payload = {'isOverlayRequired': overlay,
                'apikey': api_key,
                'language': language}

    with open(filename, 'rb') as f:
        r = requests.post('https://api.ocr.space/parse/image',
                          files={filename: f},
                          data=payload)
        try:
            parsed_data = json.loads(r.content.decode())

            # Check for missing 'ParsedResults' key
            if 'ParsedResults' not in parsed_data:
                print(f"Warning: 'ParsedResults' key missing in OCR response for '{filename}'.")
                return

            extracted_text = parsed_data['ParsedResults'][0]['ParsedText']

            with open('output.txt', 'w') as output_file:
                output_file.write(extracted_text)
            print(f"Text extracted from '{filename}' and saved to 'output.txt'")
        except (json.JSONDecodeError, KeyError) as e:
            print(f"Error processing OCR response for '{filename}': {e}")


# Replace 'YOUR_API_KEY' with your actual OCR.space API key
api_key = 'K86594455288957'

# Example usage for image or PDF file
# test_file = ocr_space_file(filename='jee_main_mock_test_01_mathongo_0006-791x1024.jpg', language='eng', api_key=api_key)
test_file = ocr_space_file(filename='jee_main_mock_test_01_mathongo_0002-791x1024.pdf', language='eng', api_key=api_key)