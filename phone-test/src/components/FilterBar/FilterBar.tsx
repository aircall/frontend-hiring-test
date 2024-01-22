import { Spacer, Form, FormItem, Select } from '@aircall/tractor';
import { directionFilterOptions, typeFilterOptions } from './utils/filter-options';

export interface FilterBarProps {
  handleFilterChange: (filterCategory: string, newFilterValue: string) => void;
}

export default function FilterBar({ handleFilterChange }: FilterBarProps) {
  return (
    <Form>
      <Spacer
        fluid={true}
        space={3}
        direction="horizontal"
        justifyContent="stretch"
        itemsSized="evenly-sized"
      >
        <FormItem label="Call Type">
          <Select
            takeTriggerWidth={true}
            placeholder="All"
            selectionMode="multiple"
            size="regular"
            options={typeFilterOptions}
            onSelectionChange={currentSelectedKeys => {
              handleFilterChange('type', currentSelectedKeys.join(','));
            }}
          />
        </FormItem>
        <FormItem label="Call Direction">
          <Select
            takeTriggerWidth={true}
            placeholder="All"
            size="regular"
            options={directionFilterOptions}
            onSelectionChange={currentSelectedKeys =>
              handleFilterChange('direction', currentSelectedKeys[0] as string)
            }
          />
        </FormItem>
      </Spacer>
    </Form>
  );
}
