//Branches Revenue Data
export type BranchRevenueData = {
  id: string;
  branchName: string;
  branchRevenue: number;
  revenueByMonth: { month: string; revenue: number }[];
}

// Top K
interface ProductData {
  productName: string;
  quantity: number;
}

interface BranchData {
  branchId: number;
  branchName: string;
  products: ProductData[];
}

export interface TopProductsBarChartProps {
  branchData: BranchData;
  topN: number;
}

{
  /* Biểu đồ Chart.js (để lại nếu cần sau này) */
}
{
  /* <h2 className="text-xl font-semibold mt-8 mb-4">Biểu đồ Chart.js</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">
            Doanh thu từng chi nhánh
          </h3>
          <BranchRevenueLineChartChartjs data={branchRevenueData} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Tổng doanh thu</h3>
          <TotalRevenueLineChartChartjs data={branchRevenueData} />
        </div>
        <div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">
            Doanh thu sản phẩm theo chi nhánh
          </h3>
          <ProductRevenueStackedBarChartChartjs data={productRevenueData} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Số lượng đơn hàng</h3>
          <OrderStatusLineChartChartjs data={orderStatusData} />
        </div>
        <div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Top sản phẩm bán chạy</h3>
          {branchData.map((branch) => (
            <div key={branch.branchId} className="mb-4">
              <TopProductsBarChartChartjs branchData={branch} topN={5} />
              <TopProductsBarChartChartjs branchData={branch} topN={7} />
              <TopProductsBarChartChartjs branchData={branch} topN={10} />
            </div>
          ))}
        </div>
      </div> */
}
