import { useFormik } from "formik";
import { Store, Phone, MapPin } from "lucide-react";
import BackButtonUser from "./ui/BackButtonUser";
import { Button } from "./ui/Button";
import { FieldLabel, renderField } from "./ui/EditFields";
import { cn } from "../utils/CN";
import { inputBase } from "../utils/inputBase";
import { sellerSchema } from "../validation/sellerSchema";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { becomeSeller } from "../redux/slice/authSlice";
import { useEffect, useRef } from "react";

// Same CSS variables CreatePanel sets on its wrapper, so EditFields render correctly on a page.
const THEME_VARS = {
  "--edit-text": "black",
  "--edit-muted": "#525252",
  "--edit-border": "#E5E5E5",
  "--edit-soft": "#FAFAFA",
  "--edit-accent": "black",
  "--edit-accent-soft": "#F5F5F5",
  "--edit-danger": "#b3261e",
};

const COUNTRY_CODES = [
  { code: "+91", label: "IN +91" },
  { code: "+971", label: "AE +971" },
  { code: "+966", label: "SA +966" },
  { code: "+974", label: "QA +974" },
  { code: "+968", label: "OM +968" },
  { code: "+965", label: "KW +965" },
  { code: "+973", label: "BH +973" },
  { code: "+44", label: "UK +44" },
  { code: "+1", label: "US +1" },
];

const COUNTRY_CODE_FIELD = {
  name: "countryCode",
  type: "select",
  options: COUNTRY_CODES.map((c) => ({ label: c.label, value: c.code })),
};

const initialValues = {
  storeName: "",
  productCategories: "",
  businessLogo: null,
  description: "",
  businessEmail: "",
  countryCode: "+91",
  businessPhone: "",
  businessAddress: "",
  pickupLocation: "",
  conditionCheck: false,
  status: "active",
};

// Field configs in the same shape CreatePanel / renderField expect.
const sections = [
  {
    icon: Store,
    title: "Store details",
    fields: [
      {
        name: "storeName",
        label: "Store name",
        type: "text",
        required: true,
        span: "full",
        placeholder: "e.g. Malabar Spice Co.",
      },
      {
        name: "productCategories",
        label: "Product category",
        type: "async-multiselect",
        asyncEntity: "category",
        required: true,
        placeholder: "Select a category",
      },
      {
        name: "businessLogo",
        label: "Store logo",
        type: "image",
        required: true,
        accept: "image/jpeg,image/png,image/webp",
        helperText: "JPG, PNG or WebP, up to 2 MB.",
      },
      {
        name: "description",
        label: "Store description",
        type: "textarea",
        rows: 4,
        required: true,
        span: "full",
        placeholder: "What do you sell, and what makes your store different?",
      },
    ],
  },
  {
    icon: Phone,
    title: "Business contact",
    fields: [
      {
        name: "businessEmail",
        label: "Business email",
        type: "email",
        required: true,
      },
      {
        name: "businessPhone",
        label: "Business phone",
        type: "phone", // handled by PhoneField below
        required: true,
        placeholder: "10-digit number",
      },
    ],
  },
  {
    icon: MapPin,
    title: "Location",
    fields: [
      {
        name: "businessAddress",
        label: "Business address",
        type: "textarea",
        rows: 2,
        required: true,
        span: "full",
        placeholder: "Registered address of your business",
      },
      {
        name: "pickupLocation",
        label: "Pickup location",
        type: "textarea",
        rows: 2,
        required: true,
        span: "full",
        placeholder: "House / building, street, area, pincode",
        helperText: "Where couriers collect your orders.",
      },
    ],
  },
];

const termsField = {
  name: "conditionCheck",
  type: "checkbox",
  checkboxLabel:
    "I agree to the seller terms and conditions and commission policy.",
};

// Country code select + number input.
function PhoneField({ field, formik }) {
  return (
    <div className="flex gap-2">
      <div className="w-32 shrink-0">
        {renderField(COUNTRY_CODE_FIELD, formik, "user")}
      </div>

      <input
        type="tel"
        inputMode="numeric"
        name={field.name}
        value={formik.values[field.name] ?? ""}
        placeholder={field.placeholder}
        onChange={(e) =>
          formik.setFieldValue(
            field.name,
            e.target.value.replace(/\D/g, "").slice(0, 10),
          )
        }
        className={inputBase}
      />
    </div>
  );
}

// Formik errors can be strings, arrays or nested objects; flatten to messages.
function flattenErrors(value) {
  if (!value) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flattenErrors);
  if (typeof value === "object")
    return Object.values(value).flatMap(flattenErrors);
  return [];
}

export default function SellerRegister() {
  const { message, sellerSubmitting, sellerError } = useSelector(
    (state) => state.auth,
  );
  const wasSubmitting = useRef(false);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues,
    validationSchema: sellerSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      const formData = new FormData();

      formData.append("storeName", values.storeName);
      formData.append("description", values.description);
      formData.append("businessEmail", values.businessEmail);
      formData.append("countryCode", values.countryCode);
      formData.append("businessPhone", values.businessPhone);
      formData.append("businessAddress", values.businessAddress);
      formData.append("pickupLocation", values.pickupLocation);
      formData.append("conditionCheck", values.conditionCheck);
      formData.append("status", values.status);

      // array field: one entry per id
      values.productCategories.forEach((id) =>
        formData.append("productCategories", id),
      );

      if (values.businessLogo) {
        formData.append("businessLogo", values.businessLogo);
      }

      dispatch(becomeSeller(formData));
    },
  });

  useEffect(() => {
    if (wasSubmitting.current && !sellerSubmitting) {
      if (sellerError) {
        toast.error(sellerError); // keep the values so the user can retry
      } else {
        toast.success(message);
        formik.resetForm();
      }
    }
    wasSubmitting.current = sellerSubmitting;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerSubmitting, sellerError]);

  // All validation messages together, shown only after a submit attempt.
  const validationErrors =
    formik.submitCount > 0 ? [...new Set(flattenErrors(formik.errors))] : [];

  const renderItem = (field) => (
    <div
      key={field.name}
      className={cn(field.span === "full" && "sm:col-span-2")}
    >
      <FieldLabel required={field.required}>{field.label}</FieldLabel>
      {field.type === "phone" ? (
        <PhoneField field={field} formik={formik} />
      ) : (
        renderField(field, formik, "user")
      )}
      {field.helperText && (
        <p className="mt-1 text-[12px] text-[var(--edit-muted)]">
          {field.helperText}
        </p>
      )}
    </div>
  );

  return (
    <div style={THEME_VARS} className="min-h-screen bg-white">
      <div className="h-24" />

      <div className="mx-auto w-full max-w-6xl px-4 pb-16">
        <BackButtonUser variant="secondary" />

        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-black sm:text-3xl">
            Become a seller on OmniMall
          </h1>
          <p className="mt-1.5 text-sm text-neutral-600">
            Tell us about your store. We'll review your application within 2 to
            3 business days.
          </p>
        </header>

        <form onSubmit={formik.handleSubmit} noValidate className="space-y-6">
          {sections.map(({ icon: Icon, title, fields }) => (
            <section
              key={title}
              className="rounded-xl border border-[#E5E5E5] bg-white p-5 sm:p-6"
            >
              <div className="mb-5 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                  <Icon size={16} />
                </span>
                <h2 className="text-base font-semibold text-black">{title}</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {fields.map(renderItem)}
              </div>
            </section>
          ))}

          <div>{renderField(termsField, formik, "user")}</div>

          {validationErrors.length > 0 && (
            <div
              role="alert"
              aria-live="polite"
              className="rounded-lg border border-red-200 bg-red-50 p-4"
            >
              <p className="mb-2 text-sm font-semibold text-red-700">
                Please fix the following errors:
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-red-600">
                {validationErrors.map((error, index) => (
                  <li key={`${error}-${index}`}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={sellerSubmitting}
              className={cn(
                "border border-black bg-black text-white",
                sellerSubmitting && "opacity-60",
              )}
            >
              {sellerSubmitting ? "Submitting..." : "Submit application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
