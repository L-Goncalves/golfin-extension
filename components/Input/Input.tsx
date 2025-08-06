import './Input.scss'

interface IProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (newValue: string) => void;
    disabled?: boolean
  }
  
  export const Input = (props: IProps) => {
    const { label, placeholder, value, onChange, disabled} = props;
  
    return (
      <div className="input-container">
        <label>{label}</label>
        <input
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)} // Propagate change to parent
        />
      </div>
    );
  };
  