import './Input.scss'

interface IProps {
    label: string;
    placeholder?: string;
}

export const Input = (props: IProps) => {
  const { label, placeholder} = props;

  return (
    <div className='input-container'>
        <label>{label}</label>
        <input placeholder={placeholder} />
      
    </div>
    
  );
};
