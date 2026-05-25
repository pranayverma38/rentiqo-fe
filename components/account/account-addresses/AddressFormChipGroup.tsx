type ChipOption = {
  value: string;
  label: string;
};

type AddressFormChipGroupProps = {
  name: string;
  legend: string;
  options: ChipOption[];
  defaultValue: string;
};

export default function AddressFormChipGroup({
  name,
  legend,
  options,
  defaultValue,
}: AddressFormChipGroupProps) {
  return (
    <fieldset className="tf-field account-address-chip-field">
      <legend className="tf-lable fw-medium account-address-chip-field__legend">
        {legend}
      </legend>
      <div className="account-address-chip-group" role="radiogroup" aria-label={legend}>
        {options.map((option) => (
          <label key={option.value} className="account-address-chip">
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={option.value === defaultValue}
            />
            <span className="account-address-chip__indicator" aria-hidden="true" />
            <span className="account-address-chip__label fw-medium">{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
