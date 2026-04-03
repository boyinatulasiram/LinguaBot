from transformers import MarianMTModel, MarianTokenizer

class Translator:
    def __init__(self):
        # Dictionary to store loaded models and tokenizers
        self.models = {}
        self.tokenizers = {}

        # Pretrained models for Hindi and Telugu
        # We use opus-mt-en-dra for Telugu since it specializes in Dravidian languages (higher accuracy)
        self.model_names = {
            'hi': 'Helsinki-NLP/opus-mt-en-hi',
            'te': 'Helsinki-NLP/opus-mt-en-dra'
        }

    def load_model(self, lang):
        """Loads the required model and tokenizer into memory if not already loaded"""
        if lang not in self.models:
            model_name = self.model_names.get(lang)
            if not model_name:
                raise ValueError("Unsupported language.")
            
            print(f"Loading model for {lang} ({model_name}). Please wait...")
            self.tokenizers[lang] = MarianTokenizer.from_pretrained(model_name)
            self.models[lang] = MarianMTModel.from_pretrained(model_name)
            print(f"Model for {lang} loaded successfully.")
    
    def translate(self, text, lang):
        """Translates the given text into the target language"""
        if lang not in self.model_names:
            raise ValueError(f"Language '{lang}' is not supported.")
            
        # Ensure the model is loaded
        self.load_model(lang)
        
        tokenizer = self.tokenizers[lang]
        model = self.models[lang]

        # For multilingual models like opus-mt-en-dra, we need to specify the target language
        if lang == 'te' and 'opus-mt-en-dra' in self.model_names[lang]:
            # The target language prefix for Telugu in opus-mt-en-dra is >>tel<<
            text = f">>tel<< {text}"

        # Tokenize and translate
        inputs = tokenizer(text, return_tensors="pt", padding=True)
        translated = model.generate(**inputs, max_length=512)
        
        # Decode the output
        translated_text = [tokenizer.decode(t, skip_special_tokens=True) for t in translated]
        
        return translated_text[0]

# Singleton instance to be used across the application
translator_instance = Translator()
