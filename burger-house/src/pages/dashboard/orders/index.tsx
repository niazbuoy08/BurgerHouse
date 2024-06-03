import clsx from 'clsx';
import OrderDataTable from '../../../components/order-data-table';
import Button from '../../../components/shared/button';
import Heading from '../../../components/shared/heading';
import PageLoader from '../../../components/shared/loaders/page-loader';
import Alert from '../../../components/shared/alert';
import Seo from '../../../components/shared/seo';
import usePagination from '../../../hooks/use-pagination';
import useAlert from '../../../hooks/use-alert';
import DashboardLayout from '../../../layouts/dashboard-layout';
import { trpc } from '../../../utils/trpc';
import { NextPageWithLayout } from '../../_app';

import classes from './my-orders.module.scss';

const DashboardOrdersPage: NextPageWithLayout = () => {
  const { page, handleNextPage, handlePrevPage } = usePagination({});
  const { setAlert, showAlert, alertMessage, alertType } = useAlert();
  const { data, isLoading, error } = trpc.order.userAll.useQuery({
    limit: 10,
    cursor: page,
  });

  if (isLoading) return <PageLoader variant="embed" />;

  if (error) {
    setAlert('danger', error.message || 'Failed to fetch orders');
  }

  return (
    <>
      <Seo title="Dashboard | My Orders" />
      {showAlert && (
        <Alert position="top-center" variant="dark" type={alertType}>
          {alertMessage}
        </Alert>
      )}

      <div className={classes.root}>
        <Heading variant="h2" className={classes.heading}>
          My Orders
        </Heading>
        {data && data?.orders.length ? (
          <OrderDataTable
            data={data}
            nextPage={handleNextPage}
            previousPage={handlePrevPage}
            page={page}
            linkUrl={`/dashboard/orders`}
          />
        ) : (
          <div className={classes.empty}>
            <Heading
              color="primary"
              variant="h2"
              className={clsx(['u-text-capitalize'])}
            >
              You have no orders
            </Heading>
            <Button isLink href="/menu" variant="tertiary-outline">
              Menu
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

DashboardOrdersPage.getLayout = (page) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardOrdersPage;
