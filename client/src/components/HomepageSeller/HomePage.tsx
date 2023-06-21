import { useEffect, useMemo, useState } from 'react'
import useAxiosPrivateSeller from '../../hooks/useAxiosPrivateSeller'
import useSeller from '../../hooks/useSeller'
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table'

interface BestSellers {
  productId: number;
  name: string;
  category: string;
  totalQuantity: number;
}

const HomePage = () => {

  const axiosPrivateSeller = useAxiosPrivateSeller();

  const { seller } = useSeller();
  const sellerId = seller.seller_id;

  const [bestSellersData, setBestSellersData] = useState<BestSellers[]>([]);

  useEffect(() => {
    const getBestSellers = async () => {
      try {
        const response = await axiosPrivateSeller.get(`/bestSellers/${sellerId}`);
        setBestSellersData(response.data);
      } catch (err: any) {
        console.log(err);
      }
    };
    
    getBestSellers();
  }, [])

  const columns = useMemo<MRT_ColumnDef<BestSellers>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        enableClickToCopy: true,
        size: 140,
      },
      {
        accessorKey: 'category',
        header: 'Category',
        enableClickToCopy: true,
        size: 80,
      },
      {
        accessorKey: 'totalQuantity',
        header: 'Sold',
        enableClickToCopy: true,
        size: 80,
      },
    ],
    []
  );


  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="text-9xl m-4 mb-2 font-extrabold">VOEK</div>
        <div className="text-4xl m-4 mt-0 mb-5 pb-5 font-semibold">Seller Centre</div>
      </div>

      <h1 className="text-xl font-medium mb-2">Best Sellers</h1>

      <MaterialReactTable 
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        columns={columns}
        data={bestSellersData}
        enableColumnOrdering
        enablePagination={false}
      />
  </div>
  )
}

export default HomePage