import { useDebouncedValue } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { IFilter } from '@/interfaces/helperInterface';

interface IUseFilterProps<T> {
  defaultParams: T;
}
const useFilter = <T,>({ defaultParams }: IUseFilterProps<T>) => {
  const [params, setParams] = useState<T>(defaultParams);
  const [filterValues, setFilterValues] = useState<IFilter[]>([]);
  const [search, setSearch] = useState('');
  const [debounced] = useDebouncedValue(search, 400);

  useEffect(() => {
    setParams((prevParams) => ({
      ...prevParams,
      search: debounced.length > 0 ? debounced : '',
    }));
  }, [debounced]);

  useEffect(() => {
    if (filterValues.length === 0) {
      setParams(defaultParams);
    } else {
      setParams((prevParams) => {
        let updatedParams = { ...prevParams };

        filterValues.forEach((item) => {
          updatedParams = {
            ...updatedParams,
            [item.key]: item.values,
          };
        });

        return updatedParams;
      });
    }
  }, [filterValues]);

  return { filterValues, setFilterValues, params, setParams, search, setSearch };
};

export default useFilter;
