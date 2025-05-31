import { ButtonProps } from '@/types';
import { classNames } from '@/components/className';

const ButtonBase = ({
  content,
  className = '',
  isDisabled = false,
  iconLeft,
  iconRight,
  onClick
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        'flex gap-2 items-center justify-center rounded-full px-4 py-2 text-base font-semibold hover:brightness-110 disabled:cursor-default disabled:opacity-50 disabled:brightness-100',
        className
      )}
      disabled={isDisabled}
      onClick={onClick}
    >
      {iconLeft}
      {content}
      {iconRight}
    </button>
  );
};

export default ButtonBase;

//Guide
//<ButtonSolid content='Solid' iconLeft={<ArrowDownCircleIcon className="h-5 w-5" />} iconRight={<ArrowUpCircleIcon className='h-5' /> } />
//<ButtonSolid content='Solid' isDisabled={true} iconRight={<ArrowUpCircleIcon className='h-10' /> } />
//<ButtonSolid content='Solid' isPrimary={true} iconLeft={<ArrowDownCircleIconOutline className="h-5 w-5" />} iconRight={<ArrowUpCircleIcon className='h-5' /> } />
//<ButtonSolid content='Solid' isPrimary={true} isDisabled={true} iconLeft={<ArrowDownCircleIconOutline className="h-10" />} />
//<ButtonOutline content='Outline' iconLeft={<ArrowDownCircleIcon className="h-5 w-5" />} iconRight={<ArrowUpCircleIcon className='h-5' /> } />
//<ButtonOutline content='Outline' isDisabled={true} iconRight={<ArrowUpCircleIcon className='h-10' /> } />
//<ButtonOutline content='Outline' isPrimary={true} iconLeft={<ArrowDownCircleIconOutline className="h-5 w-5" />} iconRight={<ArrowUpCircleIcon className='h-5' /> } />
//<ButtonOutline content='Outline' isPrimary={true} isDisabled={true} iconLeft={<ArrowDownCircleIconOutline className="h-10" />} />
//Bonus (but not rcm)
//<ButtonBase iconLeft={<ArrowDownCircleIcon className="h-5 w-5" />} iconRight={<ArrowUpCircleIcon className='h-5' /> } />
//<ButtonBase isDisabled={true} iconRight={<ArrowUpCircleIcon className='h-10' /> } />
//<ButtonBase isPrimary={true} iconLeft={<ArrowDownCircleIconOutline className="h-5 w-5" />} iconRight={<ArrowUpCircleIcon className='h-5' /> } />
//<ButtonBase isPrimary={true} isDisabled={true} iconLeft={<ArrowDownCircleIconOutline className="h-10" />} />