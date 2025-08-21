import './AppLogo.css';

interface AppLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'base' | 'lg';
}

export default function AppLogo({ size = 'lg', ...props }: AppLogoProps) {
  return (
    <div className={`app-logo font-${size}`} role="img" aria-label="지락실 로고" {...props}>
      <span aria-hidden="true">🚀</span>
      <span>지락실</span>
      <span aria-hidden="true">🚀</span>
    </div>
  );
}
