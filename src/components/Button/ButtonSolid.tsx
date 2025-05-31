import { ButtonProps } from '@/types';
import { classNames } from '@/components/className';
import ButtonBase from './ButtonBase';

const ButtonSolid = ({
  content,
  // isPrimary = false,
  isDisabled = false,
  className = '',
  iconLeft,
  iconRight,
  onClick
}: ButtonProps) => {
  return (
    <ButtonBase
      content={content}
      isDisabled={isDisabled}
      iconLeft={iconLeft}
      iconRight={iconRight}
      onClick={onClick}
      className={classNames(
        'text-on-primary',
        // isPrimary ? 'bg-secondary' : 'bg-primary',
        className
      )}
    />
  );
};

export default ButtonSolid;
