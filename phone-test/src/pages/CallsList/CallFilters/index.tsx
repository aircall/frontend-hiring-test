import { Banner, Box, Button, Flex, Form, FormItem, Grid, Select } from '@aircall/tractor';
import { CallFiltersProps } from './index.decl';
import { useBuildFilterOptions } from './useBuildFilterOptions';
import { onFilterChangeHandler } from './onFilterChangeHandler';
import { EMPTY_VALUE } from './constants';

export function CallFilters({ filters, onChangeFilters }: CallFiltersProps) {
  const { callTypeOptions, callDirectionOptions, callStatusOptions } = useBuildFilterOptions();

  const onFilterChange = onFilterChangeHandler(filters, onChangeFilters);

  return (
    <Form>
      <Grid columnGap={3} rowGap={3} gridTemplateColumns="1fr 1fr 1fr" mb={6}>
        <FormItem label="Call Type" name="filters-call-type">
          <Select
            data-test="call-type"
            size="small"
            options={callTypeOptions}
            selectedKeys={[filters?.type ?? EMPTY_VALUE]}
            onSelectionChange={selectedKeys => onFilterChange('type', selectedKeys?.[0])}
          />
        </FormItem>
        <FormItem label="Call Direction" name="filters-call-direction">
          <Select
            data-test="call-direction"
            size="small"
            options={callDirectionOptions}
            selectedKeys={[filters?.direction ?? EMPTY_VALUE]}
            onSelectionChange={selectedKeys => onFilterChange('direction', selectedKeys?.[0])}
          />
        </FormItem>
        <FormItem label="Call Status" name="filters-call-status">
          <Select
            data-test="call-status"
            size="small"
            options={callStatusOptions}
            selectedKeys={[filters?.status ?? EMPTY_VALUE]}
            onSelectionChange={selectedKeys => onFilterChange('status', selectedKeys?.[0])}
          />
        </FormItem>
      </Grid>
      <Banner.Root variant="info" mb={6}>
        <Banner.Icon />
        <Box>
          <Banner.Heading mb={1}>Filtering Limitation</Banner.Heading>
          <Banner.Paragraph>
            Please note that filtering is limited to the most recent 200 calls, and pagination is
            hidden when filters are applied.
          </Banner.Paragraph>
        </Box>
      </Banner.Root>
      <Flex justifyContent="flex-end">
        <Button type="reset" variant="standard" onClick={() => onChangeFilters({})}>
          Clear Filters
        </Button>
      </Flex>
    </Form>
  );
}
