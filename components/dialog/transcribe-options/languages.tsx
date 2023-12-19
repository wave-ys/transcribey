import {ComboBoxGroup} from "@/components/ui/combo-box";

const languages: ComboBoxGroup[] = [
  {
    key: 'lng',
    children: [
      {"label": "Auto", "value": "auto"},
      ...[
        {"label": "English", "value": "en"},
        {"label": "Chinese", "value": "zh"},
        {"label": "German", "value": "de"},
        {"label": "Spanish", "value": "es"},
        {"label": "Russian", "value": "ru"},
        {"label": "Korean", "value": "ko"},
        {"label": "French", "value": "fr"},
        {"label": "Japanese", "value": "ja"},
        {"label": "Portuguese", "value": "pt"},
        {"label": "Turkish", "value": "tr"},
        {"label": "Polish", "value": "pl"},
        {"label": "Catalan", "value": "ca"},
        {"label": "Dutch", "value": "nl"},
        {"label": "Arabic", "value": "ar"},
        {"label": "Swedish", "value": "sv"},
        {"label": "Italian", "value": "it"},
        {"label": "Indonesian", "value": "id"},
        {"label": "Hindi", "value": "hi"},
        {"label": "Finnish", "value": "fi"},
        {"label": "Vietnamese", "value": "vi"},
        {"label": "Hebrew", "value": "he"},
        {"label": "Ukrainian", "value": "uk"},
        {"label": "Greek", "value": "el"},
        {"label": "Malay", "value": "ms"},
        {"label": "Czech", "value": "cs"},
        {"label": "Romanian", "value": "ro"},
        {"label": "Danish", "value": "da"},
        {"label": "Hungarian", "value": "hu"},
        {"label": "Tamil", "value": "ta"},
        {"label": "Norwegian", "value": "no"},
        {"label": "Thai", "value": "th"},
        {"label": "Urdu", "value": "ur"},
        {"label": "Croatian", "value": "hr"},
        {"label": "Bulgarian", "value": "bg"},
        {"label": "Lithuanian", "value": "lt"},
        {"label": "Latin", "value": "la"},
        {"label": "Maori", "value": "mi"},
        {"label": "Malayalam", "value": "ml"},
        {"label": "Welsh", "value": "cy"},
        {"label": "Slovak", "value": "sk"},
        {"label": "Telugu", "value": "te"},
        {"label": "Persian", "value": "fa"},
        {"label": "Latvian", "value": "lv"},
        {"label": "Bengali", "value": "bn"},
        {"label": "Serbian", "value": "sr"},
        {"label": "Azerbaijani", "value": "az"},
        {"label": "Slovenian", "value": "sl"},
        {"label": "Kannada", "value": "kn"},
        {"label": "Estonian", "value": "et"},
        {"label": "Macedonian", "value": "mk"},
        {"label": "Breton", "value": "br"},
        {"label": "Basque", "value": "eu"},
        {"label": "Icelandic", "value": "is"},
        {"label": "Armenian", "value": "hy"},
        {"label": "Nepali", "value": "ne"},
        {"label": "Mongolian", "value": "mn"},
        {"label": "Bosnian", "value": "bs"},
        {"label": "Kazakh", "value": "kk"},
        {"label": "Albanian", "value": "sq"},
        {"label": "Swahili", "value": "sw"},
        {"label": "Galician", "value": "gl"},
        {"label": "Marathi", "value": "mr"},
        {"label": "Punjabi", "value": "pa"},
        {"label": "Sinhala", "value": "si"},
        {"label": "Khmer", "value": "km"},
        {"label": "Shona", "value": "sn"},
        {"label": "Yoruba", "value": "yo"},
        {"label": "Somali", "value": "so"},
        {"label": "Afrikaans", "value": "af"},
        {"label": "Occitan", "value": "oc"},
        {"label": "Georgian", "value": "ka"},
        {"label": "Belarusian", "value": "be"},
        {"label": "Tajik", "value": "tg"},
        {"label": "Sindhi", "value": "sd"},
        {"label": "Gujarati", "value": "gu"},
        {"label": "Amharic", "value": "am"},
        {"label": "Yiddish", "value": "yi"},
        {"label": "Lao", "value": "lo"},
        {"label": "Uzbek", "value": "uz"},
        {"label": "Faroese", "value": "fo"},
        {"label": "Haitian Creole", "value": "ht"},
        {"label": "Pashto", "value": "ps"},
        {"label": "Turkmen", "value": "tk"},
        {"label": "Nynorsk", "value": "nn"},
        {"label": "Maltese", "value": "mt"},
        {"label": "Sanskrit", "value": "sa"},
        {"label": "Luxembourgish", "value": "lb"},
        {"label": "Myanmar", "value": "my"},
        {"label": "Tibetan", "value": "bo"},
        {"label": "Tagalog", "value": "tl"},
        {"label": "Malagasy", "value": "mg"},
        {"label": "Assamese", "value": "as"},
        {"label": "Tatar", "value": "tt"},
        {"label": "Hawaiian", "value": "haw"},
        {"label": "Lingala", "value": "ln"},
        {"label": "Hausa", "value": "ha"},
        {"label": "Bashkir", "value": "ba"},
        {"label": "Javanese", "value": "jw"},
        {"label": "Sundanese", "value": "su"},
        {"label": "Cantonese", "value": "yue"},
      ].sort((a, b) => a.label.toLocaleLowerCase().localeCompare(b.label.toLocaleLowerCase()))
    ]
  }
]

export default languages;