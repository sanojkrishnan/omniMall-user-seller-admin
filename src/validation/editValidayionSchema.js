import * as Yup from "yup";

export default function buildValidationSchema(fields) {
  const shape = {};
  fields.forEach((field) => {
    if (field.validation) {
      shape[field.name] = field.validation;
      return;
    }

    let rule;
    switch (field.type) {
      case "number":
      case "range":
        rule = Yup.number()
          .typeError(`${field.label} must be a number`)
          .transform((value, originalValue) =>
            originalValue === "" ? undefined : value,
          );
        break;
      case "toggle":
      case "checkbox":
        rule = Yup.boolean();
        break;
      case "multiselect":
      case "checkbox-group":
      case "tags":
        rule = Yup.array();
        break;
      case "email":
        rule = Yup.string().email(`${field.label} must be a valid email`);
        break;
      case "url":
        rule = Yup.string().url(`${field.label} must be a valid URL`);
        break;
      case "image":
      case "file":
        rule = Yup.mixed();
        break;
      default:
        rule = Yup.string();
    }

    if (field.required) {
      rule =
        field.type === "multiselect" ||
        field.type === "checkbox-group" ||
        field.type === "tags"
          ? rule.min(1, `${field.label} is required`)
          : rule.required(`${field.label} is required`);
    }

    shape[field.name] = rule;
  });
  return Yup.object().shape(shape);
}
