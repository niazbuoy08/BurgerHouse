import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import { HiOutlineSearch } from 'react-icons/hi';

import classes from './menu.module.scss';
import Button from '../../components/shared/button';
import FormInput from '../../components/shared/form-input';
import Heading from '../../components/shared/heading';
import usePagination from '../../hooks/use-pagination';
import Pagination from '../../components/shared/pagination';
import BurgerCardSkeleton from '../../components/burger-card/BurgerCardSkeleton';
import BurgerCard from '../../components/burger-card';
import BaseLayout from '../../layouts/base-layout';
import Seo from '../../components/shared/seo';

import { trpc } from '../../utils/trpc';

const MenuPage = () => {
  const router = useRouter();
  const { page, handleNextPage, handlePrevPage, reset, handlePage } =
    usePagination();
  const [search, setSearch] = useState((router.query.search as string) || '');

  const { data, isLoading, error } = trpc.burger.all.useQuery({
    limit: 4,
    page,
    search,
  });

  // Effect to log data or errors for debugging
  useEffect(() => {
    console.log('Burger data:', data);
    if (error) {
      console.error('Error fetching burgers:', error);
    }
  }, [data, error]);

  const handleSubmit = async (values, actions) => {
    const { search: newSearch } = values;
    setSearch(newSearch);
    await handlePage(1);
    router.push({
      pathname: router.pathname,
      query: { page: 1, search: newSearch },
    });
    actions.resetForm();
  };

  return (
    <>
      <Seo title="Menu" />
      <div className={classes.root}>
        <div className={classes.container}>
          <Heading
            variant="h1"
            hasMarginBottom
            weight="regular"
            color="primary"
          >
            Menu
          </Heading>

          <div className={classes.filter}>
            <Formik initialValues={{ search: '' }} onSubmit={handleSubmit}>
              {() => (
                <Form className={classes.search}>
                  <FormInput
                    name="search"
                    placeholder="Search by name"
                    className="u-w-100"
                  />
                  <HiOutlineSearch
                    size={20}
                    className={classes['search__icon']}
                  />
                  <input type="submit" style={{ display: 'none' }} />
                </Form>
              )}
            </Formik>

            <div className={classes.cta}>
              {search && (
                <Button
                  onClick={() => {
                    router.push({
                      pathname: router.pathname,
                      query: { ...router.query, search: undefined },
                    });
                    setSearch('');
                    reset();
                  }}
                  size="sm"
                  variant="tertiary-outline"
                >
                  Clear Search
                </Button>
              )}
              <Button size="sm" href="/menu/make-burger" isLink>
                Make Burger
              </Button>
            </div>
          </div>

          <div className={classes.items}>
            {isLoading
              ? Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <BurgerCardSkeleton
                      key={i}
                      imageH={200}
                      numberOfLines={3}
                    />
                  ))
              : data?.burgers.map((burger) => (
                  <BurgerCard key={burger._id} size="sm" burger={burger} />
                ))}
          </div>

          <Pagination
            className={classes.pagination}
            hasMore={!!data?.hasMore}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            page={page}
          />
        </div>
      </div>
    </>
  );
};

MenuPage.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;

export default MenuPage;
