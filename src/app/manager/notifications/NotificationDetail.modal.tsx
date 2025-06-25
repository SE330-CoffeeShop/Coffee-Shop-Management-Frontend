import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { NotificationDto } from "@/types/notification.type";
import { X, CheckCircle, Bell } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface NotificationDetailModalProps {
  isOpen: boolean;
  notification: NotificationDto | null;
  onClose: () => void;
  onMarkAsRead: (notificationId: string) => void;
}

const NotificationDetailModal = ({
  isOpen,
  notification,
  onClose,
  onMarkAsRead,
}: NotificationDetailModalProps) => {
  if (!notification) return null;

  const formattedTime = format(new Date(notification.createdAt), "dd/MM/yyyy HH:mm", { locale: vi });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="bg-white rounded-2xl shadow-xl max-w-lg w-full transform transition-all duration-300 ease-in-out"
      aria-labelledby="notification-modal-title"
      aria-describedby="notification-modal-description"
    >
      <ModalContent>
        <ModalHeader className="text-lg-semibold text-secondary-900 border-b border-gray-200 gap-4 flex items-center">
          <Bell className="w-5 h-5" />
          <h2 id="notification-modal-title" className="text-lg font-semibold">
            Chi tiết thông báo
          </h2>
        </ModalHeader>
        <ModalBody className="p-6">
          <div className="grid grid-cols-2 gap-x-1 gap-y-4">
            <div className="flex items-center">
              <strong className="text-sm-semibold text-secondary-500">
                Loại:
              </strong>
            </div>
            <div className="flex items-center">
              <span className="text-sm-regular text-secondary-500">
                {notification.notificationType}
              </span>
            </div>

            <div className="flex items-center">
              <strong className="text-sm-semibold text-secondary-500">
                Nội dung:
              </strong>
            </div>
            <div className="flex items-center">
              <span className="text-sm-regular text-secondary-500">
                {notification.notificationContent}
              </span>
            </div>

            <div className="flex items-center">
              <strong className="text-sm-semibold text-secondary-500">
                Ngày tạo:
              </strong>
            </div>
            <div className="flex items-center">
              <span className="text-sm-regular text-secondary-500">
                {formattedTime}
              </span>
            </div>

            <div className="flex items-center">
              <strong className="text-sm-semibold text-secondary-500">
                Trạng thái:
              </strong>
            </div>
            <div className="flex items-center">
              <span className="text-sm-regular text-secondary-500">
                {notification.read ? "Đã đọc" : "Chưa đọc"}
              </span>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="border-t border-gray-200">
          {!notification.read && (
            <Button
              color="primary"
              onClick={() => onMarkAsRead(notification.id)}
              className="bg-primary-700 hover:bg-primary-600 text-white rounded-lg px-4 py-2"
            >
              Đánh dấu đã đọc
            </Button>
          )}
          <Button
            color="danger"
            variant="light"
            onClick={onClose}
            className="text-danger-600 hover:text-danger-700 rounded-lg px-4 py-2"
          >
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NotificationDetailModal;