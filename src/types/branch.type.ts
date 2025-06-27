export type CreateBranchDto = {
  branchName: string;
  branchAddress: string;
  branchPhone: string;
  branchEmail: string;
};

export interface BranchType {
  id: string;
  createdAt: string;
  updatedAt: string;
  branchName: string;
  branchAddress: string;
  branchPhone: string;
  branchEmail: string;
  managerId: string;
  managerName: string;
}

export type UpdateBranchDto = {
  branchId?: string;
  branchName?: string;
  branchAddress?: string;
  branchPhone?: string;
  branchEmail?: string;
  managerId?: string;
}