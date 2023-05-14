

  function addWeeks(date, weeks) {
    date.setDate(date.getDate() + 7 * weeks);
    return date;
  }
  
  function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber);
  
    return date.toLocaleString("en-US", { month: "long" });
  }
  
  // helper function to get week number of a date
  function getWeekNumber(date) {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }
  
  export function getExpensesByMonthAndWeek(transactions, rates) {
    // sort transactions by date in ascending order
    if (!transactions.length) {
        return [[], []];
    }

    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

  
    // get the first transaction date
    const firstTransactionDate = new Date(transactions[0].date);
    // console.log(firstTransactionDate);
  
    // initialize arrays for monthly and weekly expenses
    const monthlyExpenses = [];
    const weeklyExpenses = [];
  
    // initialize variables for tracking current month and week
    //let currentWeekYear = firstTransactionDate.getUTCFullYear();
    let currentMonthYear = firstTransactionDate.getUTCFullYear();
    let currentMonth = firstTransactionDate.getUTCMonth();
    let IterDate = firstTransactionDate; // date that will be used to iterate through weeks starting from the first transaction date
  
    // initialize variables for tracking total expenses per month and week
    let totalMonthExpense = 0;
    let totalWeekExpense = 0;
  
    // loop through transactions and calculate total expenses per month and week
    for (const transaction of transactions) {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getUTCFullYear();
      const transactionMonth = transactionDate.getMonth();
      const transactionWeek = getWeekNumber(transactionDate);
  
      let monthIterator = 0; // safety measure incremented each time the while loop makes a pass to prevent potential infinite loop if code gets changed in the future and breaks.
  
      // if the iteration date's month or year does not match that of the transaction, then the expenses thus far for that month will be pushed to the month array and the monthexpense variable will be set to 0. If both month and year matches, then the while loop will not run and the monthexpense variable will be incremented by the transaction amount
      while (
        transactionMonth !== currentMonth ||
        transactionYear !== currentMonthYear
      ) {
        monthlyExpenses.push({
          month: getMonthName(currentMonth),
          year: currentMonthYear,
          amount: totalMonthExpense,
        });
        totalMonthExpense = 0;
        //currentMonth = transactionMonth;
  
        currentMonth += 1;
        currentMonth %= 12;
        if (currentMonth === 0) {
          currentMonthYear += 1;
        }
  
        // limits while loop to 500 passess.
        monthIterator++;
        if (monthIterator === 500) {
          console.log("Month Overrun");
          console.log(monthlyExpenses);
          return;
        }
      }
      monthIterator = 0;
      // if transaction is in a new week, add previous week's total to array
      while (
        transactionWeek !== getWeekNumber(IterDate) ||
        transactionYear !== IterDate.getUTCFullYear()
      ) {
        if (transactionWeek === getWeekNumber(IterDate)) {
          if (transactionYear === IterDate.getUTCFullYear() + 1) {
            break;
          }
          //do else
        }
  
        weeklyExpenses.push({
          week: getWeekNumber(IterDate),
          year: IterDate.getUTCFullYear(),
          amount: totalWeekExpense,
        });
        totalWeekExpense = 0;
  
        //console.log(`Week: ${getWeekNumber(IterDate)}  Year: ${IterDate.getUTCFullYear()}`);
        addWeeks(IterDate, 1);
  
        monthIterator++;
        if (monthIterator === 50) {
          console.log("Week Overrun");
          return;
        }
      }
      // add transaction amount to current month and week totals
      totalMonthExpense += parseInt(transaction.spending_amount)*rates[localStorage.getItem("currency")];
      totalWeekExpense += parseInt(transaction.spending_amount)*rates[localStorage.getItem("currency")];
    }
  
    // add last month and week totals to arrays
    monthlyExpenses.push({
      month: getMonthName(currentMonth),
      year: currentMonthYear,
      amount: totalMonthExpense,
    });
    weeklyExpenses.push({
      week: getWeekNumber(IterDate),
      year: IterDate.getUTCFullYear(),
      amount: totalWeekExpense,
    });
  
    // return array of monthly and weekly expenses
    return [monthlyExpenses, weeklyExpenses];
  }
  
  export function getLastSix(array) {
    return array
      .map((item, index) => {
        if (index >= array.length - 6) {
          return item;
        }
        return null; // Return null for the other items
      })
      .filter((item) => item !== null); // Filter out the null values
  }

  
  // export function splitByCategory(array) {
  //   const result = {};
  
  //   // Split data into categories
  //   array.forEach(({ spending_name, spending_amount }) => {
  //     if (!result[spending_name]) {
  //       result[spending_name] = [];
  //     }
  
  //     result[spending_name].push(spending_amount);
  //   });
  
  //   // Transform data into desired format
  //   return Object.entries(result).map(([name, amounts]) => ({ name, amounts }));
  // }
  
  // function groupByTimePeriod(array, period) {
  //   const result = {};
  
  //   array.forEach(({ spending_name, spending_amount, date }) => {
  //     const parsedDate = new Date(date);
  //     const monthIndex = parsedDate.getMonth();
  //     const monthName = new Date(parsedDate.getFullYear(), monthIndex).toLocaleString('default', { month: 'long' });
  //     const weekName = getWeekNumber(parsedDate);
  //     const timePeriod = period === 'month' ? monthName : weekName
  
  //     if (!result[timePeriod]) {
  //       result[timePeriod] = {};
  //     }
  
  //     if (!result[timePeriod][spending_name]) {
  //       result[timePeriod][spending_name] = [];
  //     }
  
  //     result[timePeriod][spending_name].push(spending_amount);
  //   });
  
  //   // Transform data into desired format
  //   return Object.entries(result).map(([period, categories]) => {
  //     const amounts = Object.entries(categories).map(([name, amounts]) => ({ name, amounts }));
  //     return { period, amounts };
  //   });
  // }
  
  // export function groupByMonth(array) {
  //   return groupByTimePeriod(array, 'month');
  // }
  
  // export function groupByWeek(array) {
  //   return groupByTimePeriod(array, 'week');
  // }
  

  