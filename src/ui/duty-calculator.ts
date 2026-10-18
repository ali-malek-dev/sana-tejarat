const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

const InputField = { FOB: 'fob', FREIGHT: 'freight', INSURANCE: 'insurance', DUTY_RATE: 'dutyRate', VAT_RATE: 'vatRate' } as const;
const OutputField = { CUSTOMS_VALUE: 'customsValue', DUTY: 'duty', VAT: 'vat', TOTAL: 'total' } as const;

const money = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 });

/** Accepts Persian, Arabic or Latin digits and any thousands separators. */
const parseAmount = (raw: string) => {
  const latin = [...raw]
    .map((char) => {
      const persian = PERSIAN_DIGITS.indexOf(char);
      const arabic = ARABIC_DIGITS.indexOf(char);
      return persian >= 0 ? String(persian) : arabic >= 0 ? String(arabic) : char;
    })
    .join('')
    .replace(/[,،٬\s]/g, '')
    .replace('٫', '.');
  const value = Number.parseFloat(latin);
  return Number.isFinite(value) && value > 0 ? value : 0;
};

/**
 * Customs value (CIF) = FOB + freight + insurance; duty = CIF × duty rate;
 * VAT = (CIF + duty) × VAT rate. Rates are entered by the visitor — see docs/BRIEF.md open questions.
 */
export const initDutyCalculator = (form: HTMLFormElement) => {
  const read = (name: string) => parseAmount((form.elements.namedItem(name) as HTMLInputElement).value);
  const write = (name: string, value: number) => {
    (form.elements.namedItem(name) as HTMLOutputElement).value = money.format(Math.round(value));
  };

  const recalculate = () => {
    const customsValue = read(InputField.FOB) + read(InputField.FREIGHT) + read(InputField.INSURANCE);
    const duty = (customsValue * read(InputField.DUTY_RATE)) / 100;
    const vat = ((customsValue + duty) * read(InputField.VAT_RATE)) / 100;
    write(OutputField.CUSTOMS_VALUE, customsValue);
    write(OutputField.DUTY, duty);
    write(OutputField.VAT, vat);
    write(OutputField.TOTAL, duty + vat);
  };

  form.addEventListener('input', recalculate);
  form.addEventListener('submit', (event) => event.preventDefault());
  recalculate();
};
