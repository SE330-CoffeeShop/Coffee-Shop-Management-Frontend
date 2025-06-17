import { ReactNode } from "react";

export type ButtonProps = {
  content?: string;
  className?: string;
  isPrimary?: boolean;
  isDisabled?: boolean;
  iconLeft?: ReactNode | null;
  iconRight?: ReactNode | null;
  onClick?: () => void;
};

export type InputProps = {
  title: string;
  valid?: 'default' | 'error_AtLeast' | 'error_SameName' | 'success';
  placeholder?: string;
  value?: string | number;
  radioValues?: string[];
  readOnly?: boolean;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  required?: boolean;
  type?: string;
  suport?: string;
};

export type SearchBarProps = {
  onSearch: (keyword: string) => void;
}

export type ModalProps = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  onClose: () => void;
  onCallParent?: () => void; // Callback báo cho parent biết đã tạo xong
};