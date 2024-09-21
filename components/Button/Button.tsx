import './Button.scss'

interface IProps {
    children: React.ReactNode;
    onClick: () => void;
}

export const Button = (props: IProps) => {
  const { children, onClick } = props;

  return (
    <button onClick={onClick} className="btn">{children}</button>
  );
};
