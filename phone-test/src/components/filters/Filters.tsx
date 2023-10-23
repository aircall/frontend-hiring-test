import {
  Dropdown,
  DropdownButton,
  Menu,
  MenuItem,
  MenuItemGroup,
  MenuItemRootProps,
  PreferencesOutlined,
  Typography,
  useTheme
} from '@aircall/tractor';

interface FilterGroup {
  onChange: (value: string) => void;
  options: Array<{
    label: string;
    value: string;
  }>;
  selected: string;
  title: string;
}

interface FiltersProps {
  filterGroups: Array<FilterGroup>;
}

export const Filters = ({ filterGroups }: FiltersProps) => {
  const theme = useTheme();

  return (
    <Dropdown
      trigger={
        <DropdownButton iconClose={<PreferencesOutlined />} mode="link" variant="primary">
          Filters
        </DropdownButton>
      }
    >
      <Menu>
        {filterGroups.map(({ onChange, options, selected, title }) => (
          <MenuItemGroup key={title}>
            <Typography
              color={theme.colors['primary-500']}
              p={12}
              textAlign="start"
              variant="caption"
            >
              {title}
            </Typography>
            {[{ label: 'All', value: 'all' }, ...options].map(({ label, value }) => (
              <MenuItem.Root
                itemKey={value}
                key={value}
                onClick={onChange as MenuItemRootProps['onClick']}
              >
                {label}
                {selected === value && <MenuItem.CheckIcon />}
              </MenuItem.Root>
            ))}
          </MenuItemGroup>
        ))}
      </Menu>
    </Dropdown>
  );
};
