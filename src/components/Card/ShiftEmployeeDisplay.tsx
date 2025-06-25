import React from "react";
import { Card, CardBody, Image, Chip } from "@heroui/react";
import { ShiftDto } from "@/types/shift.type";
import { formatNumberWithCommas } from "@/helpers";
import { classNames } from "@/components/className";

interface ShiftEmployeeDisplayCardProps {
  id: string;
  shiftStartTime: string;
  shiftEndTime: string;
  dayOfWeek: string;
  month: number;
  year: number;
  shiftSalary: number;
  employeeId: string;
  employeeFullName: string;
  employeeAvatarUrl: string;
  checkin: boolean;
}

const ShiftEmployeeDisplayCard: React.FC<ShiftEmployeeDisplayCardProps> = ({
  id,
  shiftStartTime,
  shiftEndTime,
  dayOfWeek,
  month,
  year,
  shiftSalary,
  employeeId,
  employeeFullName,
  employeeAvatarUrl,
  checkin,
}) => {
  const formattedDate = `${dayOfWeek}, ${month
    .toString()
    .padStart(2, "0")}/${year}`;

  return (
    <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardBody className="p-6 flex flex-col gap-4">
        {/* Avatar and Name */}
        <div className="flex items-center gap-4">
          <Image
            src={employeeAvatarUrl}
            alt={employeeFullName}
            className="w-16 h-16 object-cover rounded-full border-2 border-gray-200"
            fallbackSrc="/placeholder-image.png"
          />
          <div>
            <h4 className="text-lg-semibold text-secondary-900">
              {employeeFullName}
            </h4>
          </div>
        </div>
        {/* Shift Details */}
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs-semibold text-secondary-400 uppercase">
              Mã ca làm
            </p>
            <p className="text-sm-regular text-secondary-900">{id}</p>
          </div>
          <div>
            <p className="text-xs-semibold text-secondary-400 uppercase">
              Mã nhân viên
            </p>
            <p className="text-sm-regular text-secondary-900">{employeeId}</p>
          </div>
          <div>
            <p className="text-xs-semibold text-secondary-400 uppercase">
              Ngày
            </p>
            <p className="text-sm-regular text-secondary-900">
              {formattedDate}
            </p>
          </div>
          <div>
            <p className="text-xs-regular text-secondary-400 uppercase">
              Trạng thái
            </p>
            <p
              className={classNames(
                checkin ? "text-primary-500" : "text-error-600",
                "text-sm-regular"
              )}
            >
              {checkin ? "Đã chấm công" : "Chưa chấm công"}
            </p>
          </div>
          <div>
            <p className="text-xs-regular text-secondary-400 uppercase">
              Lương ca
            </p>
            <p className="text-sm-regular text-primary-700">
              {formatNumberWithCommas(String(shiftSalary))} VNĐ
            </p>
          </div>
          <div>
            <p className="text-xs-regular text-secondary-400 uppercase">
              Giờ bắt đầu
            </p>
            <p className="text-sm-regular text-secondary-900">
              {shiftStartTime}
            </p>
          </div>
          <div>
            <p className="text-xs-regular text-secondary-400 uppercase">
              Giờ kết thúc
            </p>
            <p className="text-sm-regular text-secondary-900">{shiftEndTime}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ShiftEmployeeDisplayCard;
