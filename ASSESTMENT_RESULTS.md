# 👨‍🎨 Assestment results

This pull request is divided into several sections, following the tasks by the level of competencies suggested.

#### Jr. SE contributions

##### Call list page
###### Pagination

1. Import the ```useState``` React hook.
2. Initialize the ```callsPerPage``` variable following the ```useState``` hook convention.
3. Add a handler function to control when the user changes the page size and reflect the change in the UI by setting the value ```callsPerPage``` accordingly.
4. Provide the ```Pagination``` component with the proper props/values/handlers.


```javascript

/**
 * @component > CallsList
 * Extracts of the code implemented
 */

import { useState } from 'react';
// ...
const [callsPerPage, setCallsPerPage] = useState<number>(5);
// ...
const handleOnPageSizeChange = (newPageSize: number): void => {
  setCallsPerPage(newPageSize);
};
// ...
<Pagination
  {...otherProps}
  pageSize={callsPerPage}
  onPageSizeChange={handleOnPageSizeChange}
/>
//...
```

5. **Demo**

![](./assets/task001.gif)

###### Filters

1. Add a filter component to allow filtering the list of calls.
2. The new UI component will consist of a form-like implementation provided with 
(From the design system components):
  - A select ```sort by date``` dropdown.
  - A select ```call types``` dropdown.
  - Link buttons to control either when filters are applied or cleared.

  ![](./assets/task002.png)

3. Add ````handler functions```` to control when user applies/clears the filters, in order to emit/executes the callback operation(s) in the parent component.
4. Develop a ````custom hook```` to extract logic from the component. (Filters and maps operations).
4. Persist filters in the browser's address bar, so that we can paginate the list by keeping the filters, as follows:

````javascript
{__DOMAIN__}/calls/?filter=value&anotherFilter=anotherValue
````

5. As the new component is intended to strictly work with the CallsList page, it's a good practice to follow this architectural pattern (Screamming).

├── scr/
│   ├── components/
│   │   └── ...
│   └── pages/
│       ├── CallsList/
│       │   ├── components/
│       │   │   └── CallsListFilters.tsx
│       │   ├── hooks/
│       │   │   └── useCallLis.tsx
│       │   └── types/
│       │       └── CallsList.d.ts
│       └── anotherPage/
│           ├── ...
│           └── ...


6. Demo

![](./assets/task002.gif)



###### Group calls

1. Add custom hook function to map the calls entries and group them by date.

> Noticed the calls are grouped by the day they occurred.

![](./assets/task003.png)

#### SE contributions
...

#### Sr. SE contributions
...

#### Staff SE contributions
...