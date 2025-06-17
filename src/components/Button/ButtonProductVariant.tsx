import ButtonOutline from "@/components/Button/ButtonOutline";
import { ButtonProps } from "@/types";
import { classNames } from "@/components";

const ButtonProductVariant = ({
  content = "",
  isDisabled = false,
  className = "",
  iconLeft,
  iconRight,
  onClick,
}: ButtonProps) => {
  const contentCAP = content?.toUpperCase();
  return (
    <ButtonOutline
      content={contentCAP}
      isDisabled={isDisabled}
      iconLeft={iconLeft}
      iconRight={iconRight}
      onClick={onClick}
      className={classNames(
        "text-center py-2 px-4",
        isDisabled ? "opacity-50 cursor-not-allowed" : "",
        className
      )}
    />
  );
};

export default ButtonProductVariant;