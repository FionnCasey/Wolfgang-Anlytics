import React, { useState, useEffect } from 'react';
import {
  useDisclosure,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Button,
  RadioGroup,
  Radio,
  Input,
  InputGroup,
  InputRightAddon,
  Grid,
} from '@chakra-ui/core';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
import Select from 'react-select';

import { useClickOutside } from 'hooks/useClickOutside';
import { formatDate } from '../Entries/utils';
import { PipelineFilter } from '../types';

const enquiryFilters = ['Date', 'Status'];

interface FilterProps {
  isOpen: boolean;
  close: () => void;
  filter?: PipelineFilter;
  handleSubmit: (values: PipelineFilter) => void;
}

const operatorOptions = [
  { label: 'Greater Than', value: 'greater than' },
  { label: 'Less Than', value: 'less than' },
  { label: 'Between', value: 'between' },
];

const TimeFilter: React.FC<FilterProps> = ({ isOpen, close, filter, handleSubmit }) => {
  const [operator, setOperator] = useState(operatorOptions[0]);
  const [_start, setStart] = useState(0);
  const [_end, setEnd] = useState(1);

  const onSubmit = () => {
    handleSubmit({
      column: 'Time in Pipe',
      operator: operator.value,
      value: operator.value === 'between' ? `${_start} and ${_end}` : _start,
    });
    close();
  };

  return (
    <Popover placement="auto" isOpen={isOpen}>
      <PopoverTrigger>
        <div style={{ visibility: 'hidden', width: '100%', height: '100%' }}></div>
      </PopoverTrigger>
      <PopoverContent
        zIndex={100}
        _focus={{ outline: 'none' }}
        position="absolute"
        border={0}
        minWidth={350}
      >
        <PopoverHeader textAlign="center" fontWeight={700} color="gray.600">
          Time in Pipe
        </PopoverHeader>
        <PopoverBody onClick={(e) => e.stopPropagation()}>
          <Select
            value={operator}
            options={operatorOptions}
            onChange={(selected) => setOperator(selected as any)}
          />
          <Grid templateColumns={operator.value === 'between' ? '1fr auto 1fr' : '1fr'} alignItems="center" columnGap={3}>
            <InputGroup size="md" my={2}>
              <Input
                type="number"
                rounded="0"
                value={_start}
                onChange={(e: any) => setStart(e.target.value)}
                isFullWidth
                min={0}
              />
              <InputRightAddon children="days" />
            </InputGroup>
            {operator.value === 'between' && (
              <>
                <Text textAlign="center" fontWeight={500}>and</Text>
                <InputGroup size="md" my={2}>
                  <Input
                    type="number"
                    rounded="0"
                    value={_end}
                    onChange={(e: any) => setEnd(e.target.value)}
                    isFullWidth
                    min={0}
                  />
                  <InputRightAddon children="days" />
                </InputGroup>
              </>
            )}
          </Grid>
          <Button
            size="sm"
            isFullWidth
            variantColor="blue"
            variant="ghost"
            fontWeight={400}
            onClick={onSubmit}
          >
            Apply Filter
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const DateFilter: React.FC<FilterProps> = ({ isOpen, close, filter, handleSubmit }) => {
  const dates = filter ? (filter.value as string).split(' and ') : [new Date(), new Date()];

  const [_start, setStart] = useState(new Date(dates[0]));
  const [_end, setEnd] = useState(new Date(dates[1]));

  const handleChange = (range: any) => {
    setStart(range.range1.startDate);
    setEnd(range.range1.endDate);
  };

  const onSubmit = () => {
    handleSubmit({
      column: 'Date',
      operator: 'between',
      value: `${formatDate(_start)} and ${formatDate(_end)}`,
    });
    close();
  };

  return (
    <Popover placement="auto" isOpen={isOpen}>
      <PopoverTrigger>
        <div style={{ visibility: 'hidden', width: '100%', height: '100%' }}></div>
      </PopoverTrigger>
      <PopoverContent
        zIndex={100}
        _focus={{ outline: 'none' }}
        position="absolute"
        border={0}
        minWidth={350}
      >
        <PopoverHeader textAlign="center" fontWeight={700} color="gray.600">
          Date
        </PopoverHeader>
        <PopoverBody onClick={(e) => e.stopPropagation()}>
          <DateRange
            ranges={[
              {
                startDate: _start,
                endDate: _end,
              },
            ]}
            onChange={handleChange}
          />
          <Button
            size="sm"
            isFullWidth
            variantColor="blue"
            variant="ghost"
            fontWeight={400}
            onClick={onSubmit}
          >
            Apply Filter
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const StatusFilter: React.FC<FilterProps> = ({ filter, handleSubmit, isOpen, close }) => {
  const [status, setStatus] = useState('Open');

  const onSubmit = () => {
    handleSubmit({ column: 'Status', operator: 'is', value: status });
    close();
  };

  return (
    <Popover placement="auto" isOpen={isOpen}>
      <PopoverTrigger>
        <div style={{ visibility: 'hidden', width: '100%', height: '100%' }}></div>
      </PopoverTrigger>
      <PopoverContent zIndex={100} _focus={{ outline: 'none' }} position="absolute" border={0}>
        <PopoverHeader textAlign="center" fontWeight={700} color="gray.600">
          Status
        </PopoverHeader>
        <PopoverBody onClick={(e) => e.stopPropagation()}>
          <RadioGroup
            defaultValue={status}
            size="sm"
            onChange={(e, val) => setStatus(val as string)}
          >
            <Radio variantColor="green" value="Open">
              Open
            </Radio>
            <Radio variantColor="red" value="Closed">
              Closed
            </Radio>
          </RadioGroup>
          <Button
            size="sm"
            isFullWidth
            variantColor="blue"
            variant="ghost"
            fontWeight={400}
            onClick={onSubmit}
            mt={2}
          >
            Apply Filter
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

interface MenuItemProps {
  label: string;
  current?: string;
  setCurrent: (label?: string) => void;
  close: () => void;
  handleSubmit: (values: any) => void;
  filter?: PipelineFilter;
}

const FilterMenuItem: React.FC<MenuItemProps> = ({
  label,
  current,
  setCurrent,
  close,
  handleSubmit,
  filter,
}) => {
  const onClose = () => {
    setCurrent(undefined);
    close();
  };

  return (
    <>
      <MenuItem as="div" onClick={() => setCurrent(current === label ? undefined : label)}>
        <Text w="100%" fontFamily="inherit" color={current === label ? 'purple.600' : undefined}>
          {label}
        </Text>
        {label === 'Date' && (
          <DateFilter
            isOpen={current === 'Date'}
            close={onClose}
            handleSubmit={handleSubmit}
            filter={filter}
          />
        )}
        {label === 'Status' && (
          <StatusFilter
            isOpen={current === 'Status'}
            close={onClose}
            handleSubmit={handleSubmit}
            filter={filter}
          />
        )}
        {label === 'Time in Pipe' && (
          <TimeFilter
            isOpen={current === 'Time in Pipe'}
            close={onClose}
            handleSubmit={handleSubmit}
            filter={filter}
          />
        )}
      </MenuItem>
    </>
  );
};

interface Props {
  filters: PipelineFilter[];
  setFilters: (filters: PipelineFilter[]) => void;
}

const FilterMenu: React.FC<Props> = ({ filters, setFilters }) => {
  const [current, setCurrent] = useState<string>();
  const { onToggle, isOpen, onClose } = useDisclosure();

  const handleClick = (e: MouseEvent) => {
    // @ts-ignore
    if (!e.path.find((x) => x.id === 'menu')) {
      setCurrent(undefined);
      onClose();
    }
  };

  const dateFilter = filters.find((x) => x.column === 'Date');
  const statusFilter = filters.find((x) => x.column === 'Date');

  const ref = useClickOutside(handleClick, isOpen);

  useEffect(() => {
    if (!current) onClose();
  }, [current, onClose]);

  const handleDateSubmit = (date: PipelineFilter) => {
    const current = filters.filter((x) => x.column !== 'Date');
    setFilters([...current, date]);
  };

  const handleStatusSubmit = (status: PipelineFilter) => {
    const current = filters.filter((x) => x.column !== 'Status');
    setFilters([...current, status]);
  };

  return (
    <Menu closeOnSelect={false} isOpen={isOpen}>
      <MenuButton
        as={IconButton}
        //@ts-ignore
        icon="add"
        size="sm"
        onClick={onToggle}
        mr={2}
        mb={2}
      />
      <div ref={ref}>
        <MenuList fontSize="0.85em" placement="bottom-start" id="menu">
          <MenuGroup title="Filter Column">
            {enquiryFilters.map((filter) => (
              <FilterMenuItem
                key={filter}
                label={filter}
                current={current}
                setCurrent={setCurrent}
                close={onClose}
                handleSubmit={filter === 'Date' ? handleDateSubmit : handleStatusSubmit}
                filter={filter === 'Date' ? dateFilter : statusFilter}
              />
            ))}
          </MenuGroup>
        </MenuList>
      </div>
    </Menu>
  );
};

export default FilterMenu;
