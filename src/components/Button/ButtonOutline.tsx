import { ButtonProps } from '@/types';
import { classNames } from '@/components/className';
import ButtonBase from './ButtonBase';

const ButtonOutline = ({
  content,
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
        'outline outline-outline outline-1',
        // isPrimary
        //   ? 'hover:border-secondary hover:bg-secondary hover:text-on-secondary'
        //   : 'hover:border-primary hover:bg-primary hover:text-on-primary',
          className
      )}
    />
  );
};

export default ButtonOutline;
