import {ComboBoxGroup} from "@/components/ui/combo-box";

const models: ComboBoxGroup[] = [
  {
    label: "Multilingual Model",
    key: 'multi',
    children: [
      {
        label: "Tiny",
        value: "tiny"
      },
      {
        label: "Base",
        value: "base"
      },
      {
        label: "Small",
        value: "small"
      },
      {
        label: "Medium",
        value: "medium"
      },
      {
        label: "Large",
        value: "large"
      }
    ]
  },
  {
    label: "English-only Model",
    key: 'english',
    children: [
      {
        label: "Tiny.EN",
        value: "tiny.en"
      },
      {
        label: "Base.EN",
        value: "base.en"
      },
      {
        label: "Small.EN",
        value: "small.en"
      },
      {
        label: "Medium.EN",
        value: "medium.en"
      }
    ]
  }
]

export default models;