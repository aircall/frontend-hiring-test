/**
* Group a list of calls per day.
* @key name of the property to group
* @list list of calls
*/
export function groupByDate(list: Call[], key: string) {

    return list.reduce(function (rv: any, x: any) {
      const field = new Date(x[key]).toDateString();
      if (!(field in rv)) {
        const ll = list.filter((c: any) => {
          return new Date(c.created_at).toDateString() === field
        });
        ll.forEach((el: any) => {
          (rv[field] = rv[field] || []).push(el);
        });
      }
      return rv;
    }, {});
  
  }