import { useFormik } from "formik";
import { Store, Phone, MapPin } from "lucide-react";
import BackButtonUser from "./ui/BackButtonUser";
import { Button } from "./ui/Button";
import { FieldError, FieldLabel, renderField } from "./ui/EditFields";
import { cn } from "../utils/CN";
import { inputBase } from "../utils/inputBase";
import { sellerSchema } from "../validation/sellerSchema";
import { toast } from "react-toastify";
// import { registerSeller } from "../redux/slices/sellerSlice";

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
        accept: "image/jpeg,image/png,image/webp",
        helperText: "Optional. JPG, PNG or WebP, up to 2 MB.",
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
      <select
        name="countryCode"
        value={formik.values.countryCode}
        onChange={formik.handleChange}
        className={cn(inputBase, "w-28 shrink-0")}
      >
        {COUNTRY_CODES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.label}
          </option>
        ))}
      </select>
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

export default function SellerRegistration() {
  const formik = useFormik({
    initialValues,
    validationSchema: sellerSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, helpers) => {
      try {
        const fd = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (value === null || value === "") return;
          fd.append(key, value);
        });
        // await dispatch(registerSeller(fd)).unwrap();
        helpers.resetForm();
      } catch (err) {
        toast.error(
          err?.message || "Couldn't submit your application. Try again.",
        );
      }
    },
  });

  const errorFor = (name) =>
    formik.submitCount > 0 ? formik.errors[name] : undefined;

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
      {field.helperText && !errorFor(field.name) && (
        <p className="mt-1 text-[12px] text-[var(--edit-muted)]">
          {field.helperText}
        </p>
      )}
      <FieldError message={errorFor(field.name)} />
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

          <div>
            {renderField(termsField, formik, "user")}
            <FieldError message={errorFor("conditionCheck")} />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className={cn(
                "border border-black bg-black text-white",
                formik.isSubmitting && "opacity-60",
              )}
            >
              {formik.isSubmitting ? "Submitting..." : "Submit application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
