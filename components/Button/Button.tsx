import './Button.scss'

interface IProps {
    children: React.ReactNode;
    color: string;
    onClick: () => void;
}

export const Button = (props: IProps) => {
  const { children, color, onClick } = props;

  return (
    <button onClick={onClick} className="btn" color={color}>{children}</button>
  );
};
