import './Input.scss'

interface IProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (newValue: string) => void;
  }
  
  export const Input = (props: IProps) => {
    const { label, placeholder, value, onChange } = props;
  
    return (
      <div className="input-container">
        <label>{label}</label>
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)} // Propagate change to parent
        />
      </div>
    );
  };
  