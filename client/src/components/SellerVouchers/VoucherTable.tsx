import { useEffect, useState } from "react";
import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller";
import useSeller from "../../hooks/useSeller";
import SellerVoucherModal from "./SellerVoucherModal";

interface Voucher {
  voucherId: number;
  name: string;
  amount?: number;
  percentage?: number;
  category: number;
  minSpend: number;
  expiryDate: string;
  redemptionsAvailable: number;
  active: number;
}

interface Category {
  categoryId: number;
  category: string;
}

const VoucherTable = () => {
  const [vouchers, setVouchers] = useState<any>();
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher>();
  const [categories, setCategories] = useState<Category[]>();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const axiosPrivateSeller = useAxiosPrivateSeller();
  const { seller } = useSeller();
  const sellerId = seller.seller_id;

  useEffect(() => {
    axiosPrivateSeller.get(`/getVouchers/${sellerId}`).then((response) => {
      setVouchers(response.data);
    });

    axiosPrivateSeller.get(`/getVoucherCategories`).then((response) => {
      setCategories(response.data);
    });
  }, []);

  useEffect(() => {
    console.log("vouchers: ", vouchers);
  }, [vouchers]);

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
            Your Vouchers
            <p className="mt-1 text-sm font-normal text-gray-500">
              Browse your list of Vouchers. This is designed to help you work
              and play, stay organized, grow your business, and more.
            </p>
          </caption>
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Voucher Name
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Min-Spend
              </th>
              <th scope="col" className="px-6 py-3">
                Expiry Date
              </th>
              <th scope="col" className="px-6 py-3">
                Redemptions Available
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {vouchers && (
              <>
                {vouchers.map((voucher: Voucher, index: number) => (
                  <tr
                    key={index}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {voucher.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {categories?.map((category: Category) => {
                        if (category.categoryId === voucher.category) {
                          return category.category;
                        }
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {voucher.amount
                        ? `$${voucher.amount}`
                        : `${voucher.percentage}%`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      ${voucher.minSpend}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {voucher.expiryDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {voucher.redemptionsAvailable}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <div
                        className="text-indigo-600 hover:text-indigo-900 hover:cursor-pointer"
                        onClick={() => {
                          setSelectedVoucher(voucher);
                          setOpenModal(true);
                        }}
                      >
                        Edit
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
      {openModal && (
        <SellerVoucherModal
          voucher={selectedVoucher as Voucher}
          category={categories?.find(
            (category: Category) =>
              category.categoryId === selectedVoucher?.category
          )}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
    </>
  );
};

export default VoucherTable;
