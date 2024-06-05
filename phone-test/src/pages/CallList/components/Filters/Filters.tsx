import { Divider, Form, FormItem, Grid, Select } from '@aircall/tractor';
import { callDirectionOptions, callTypeOptions } from './constants';

interface FiltersProps {
  filters: Record<string, any>;
  onFilterChange: (name: string, value: string) => void;
}

export const Filters = ({ filters, onFilterChange }: FiltersProps) => (
  <Form>
    <Grid columnGap={3} rowGap={3} gridTemplateColumns="1fr 1fr">
      <FormItem label="Call Type" name="call_type">
        <Select
          size="small"
          options={callTypeOptions}
          selectedKeys={[filters['call_type']]}
          onSelectionChange={([value]) => onFilterChange('call_type', value)}
        />
      </FormItem>
      <FormItem label="Call Direction" name="direction">
        <Select
          size="small"
          options={callDirectionOptions}
          selectedKeys={[filters['direction']]}
          onSelectionChange={([value]) => onFilterChange('direction', value)}
        />
      </FormItem>
    </Grid>
    <Divider mt={3} orientation="horizontal" size="1px" bg="neutral-700" />
  </Form>
);
