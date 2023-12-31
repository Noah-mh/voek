import { useEffect, useState } from "react";
import useAxiosPrivateSeller from "../../hooks/useAxiosPrivateSeller";
import useSeller from "../../hooks/useSeller";
import SellerEditVoucherModal from "./SellerEditVoucherModal";
import SellerAddVoucherModal from "./SellerAddVoucherModal";
import SellerDeleteVoucherModal from "./SellerDeleteVoucherModal";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";

import { ToastContainer, toast, Id } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [openEditVoucherModal, setOpenEditVoucherModal] =
    useState<boolean>(false);
  const [openAddVoucherModal, setOpenAddVoucherModal] =
    useState<boolean>(false);
  const [openDeleteVoucherModal, setOpenDeleteVoucherModal] =
    useState<boolean>(false);
  const [addVoucherStatus, setAddVoucherStatus] = useState<number>();
  const [deleteVoucherStatus, setDeleteVoucherStatus] = useState<number>();
  const [toastId, setToastId] = useState<Id | undefined>(undefined);

  const axiosPrivateSeller = useAxiosPrivateSeller();
  const { seller } = useSeller();
  const sellerId = seller.seller_id;

  const handleUpdateActive = (voucherId: number, active: number) => {
    axiosPrivateSeller
      .put(`/updateActive`, { voucherId, active })
      .then((response) => {
        if (response.status === 204) {
          axiosPrivateSeller
            .get(`/getVouchers/${sellerId}`)
            .then((response) => {
              setVouchers(response.data);
              const successMessage =
                active === 1 ? "Voucher Activated" : "Voucher Deactivated";
              toast.dismiss(toastId);

              const id = toast.success(successMessage + " 😊", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              setToastId(id);
            });
        } else {
          toast.dismiss(toastId);

          const id = toast.error("Uh-oh! Error! 😔", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setToastId(id);
        }
      });
  };

  useEffect(() => {
    axiosPrivateSeller.get(`/getVouchers/${sellerId}`).then((response) => {
      console.log(response.data);
      setVouchers(response.data);
    });

    axiosPrivateSeller.get(`/getVoucherCategories`).then((response) => {
      setCategories(response.data);
    });
  }, []);

  useEffect(() => {
    if (openEditVoucherModal === false) {
      axiosPrivateSeller.get(`/getVouchers/${sellerId}`).then((response) => {
        setVouchers(response.data);
      });
    }
  }, [openEditVoucherModal]);

  useEffect(() => {
    if (addVoucherStatus === undefined) {
      return;
    } else if (addVoucherStatus === 201) {
      axiosPrivateSeller.get(`/getVouchers/${sellerId}`).then((response) => {
        setVouchers(response.data);
      });
      toast.success("Voucher Added! 😊", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else if (addVoucherStatus === 400) {
      toast.warn("Please Fill Up All The Text Fields!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error("Uh-oh! Error! 😔", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setAddVoucherStatus(undefined);
  }, [addVoucherStatus]);

  useEffect(() => {
    if (deleteVoucherStatus === undefined) {
      return;
    } else if (deleteVoucherStatus === 202) {
      axiosPrivateSeller.get(`/getVouchers/${sellerId}`).then((response) => {
        setVouchers(response.data);
      });
      toast.success("Voucher Deleted! 😊", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error("Uh-oh! Error! 😔", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setAddVoucherStatus(undefined);
  }, [deleteVoucherStatus]);

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
        <table className="w-full text-sm text-left text-gray-500">
          <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
            <div className="flex">
              <h1 className="mr-1">Your Vouchers</h1>
              <motion.div
                className="ml-1 hover:cursor-pointer"
                whileHover={{
                  scale: 1.1,
                  rotate: -180,
                  transition: { duration: 1, type: "tween" },
                }}
                onClick={() => setOpenAddVoucherModal(true)}
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  size="lg"
                  style={{ color: "#310d20" }}
                />
              </motion.div>
            </div>
            <p className="mt-1 text-sm font-normal text-gray-500">
              Browse your list of Vouchers. This is designed to help you work
              and play, stay organized, grow your business, and more.
            </p>
          </caption>
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3">
                Voucher Name
              </th>
              <th scope="col" className="px-3 py-3">
                Category
              </th>
              <th scope="col" className="px-3 py-3">
                Price
              </th>
              <th scope="col" className="px-3 py-3">
                Min-Spend
              </th>
              <th scope="col" className="px-3 py-3">
                Expiry Date
              </th>
              <th scope="col" className="px-3 py-3">
                Redemptions Available
              </th>
              <th scope="col" className="px-3 py-3">
                Active
              </th>
              <th scope="col" className="px-3 py-3">
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
                    <td className="px-3 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {voucher.name}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {categories?.map((category: Category) => {
                        if (category.categoryId === voucher.category) {
                          return category.category;
                        }
                      })}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {voucher.amount
                        ? `$${voucher.amount}`
                        : `${voucher.percentage}%`}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                      ${voucher.minSpend}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {voucher.expiryDate}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {voucher.redemptionsAvailable}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {voucher.active === 1 ? (
                        <div
                          className="hover:cursor-pointer"
                          onClick={() => {
                            handleUpdateActive(voucher.voucherId, 0);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faToggleOn}
                            size="2xl"
                            style={{ color: "#5c4444" }}
                          />
                        </div>
                      ) : (
                        <div
                          className="hover:cursor-pointer"
                          onClick={() => {
                            handleUpdateActive(voucher.voucherId, 1);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faToggleOff}
                            size="2xl"
                            style={{ color: "#5c4444" }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-4 text-sm font-medium text-right whitespace-nowrap flex">
                      <div
                        className="mx-1 hover:cursor-pointer"
                        onClick={() => {
                          setSelectedVoucher(voucher);
                          setOpenDeleteVoucherModal(true);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          size="lg"
                          style={{ color: "#5c4444" }}
                        />
                      </div>
                      <div
                        className="text-softerPurple hover:text-purpleAccent hover:cursor-pointer mx-1"
                        onClick={() => {
                          setSelectedVoucher(voucher);
                          setOpenEditVoucherModal(true);
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
      {openEditVoucherModal && (
        <SellerEditVoucherModal
          voucher={selectedVoucher as Voucher}
          category={categories?.find(
            (category: Category) =>
              category.categoryId === selectedVoucher?.category
          )}
          openModal={openEditVoucherModal}
          setOpenModal={setOpenEditVoucherModal}
        />
      )}

      {openAddVoucherModal && (
        <SellerAddVoucherModal
          categories={categories as Category[]}
          openModal={openAddVoucherModal}
          setOpenModal={setOpenAddVoucherModal}
          setAddVoucherStatus={setAddVoucherStatus}
        />
      )}

      {openDeleteVoucherModal && (
        <SellerDeleteVoucherModal
          voucher={selectedVoucher as Voucher}
          openModal={openDeleteVoucherModal}
          setOpenModal={setOpenDeleteVoucherModal}
          setDeleteVoucherStatus={setDeleteVoucherStatus}
        />
      )}

      <ToastContainer />
    </>
  );
};

export default VoucherTable;
