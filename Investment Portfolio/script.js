let investments = [];
let totalValue = 0;
let portfolioChart;

// Add event listener to the form for adding investments
document.getElementById('investmentForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page reload

    // Get input values
    const assetName = document.getElementById('assetName').value;
    const investmentAmount = parseFloat(document.getElementById('investmentAmount').value);
    const currentValue = parseFloat(document.getElementById('currentValue').value);

    // Create investment object
    const investment = {
        assetName: assetName,
        investmentAmount: investmentAmount,
        currentValue: currentValue,
        percentageChange: calculatePercentageChange(investmentAmount, currentValue)
    };

    // Add investment to array and update total value
    investments.push(investment);
    totalValue += currentValue;

    // Update investment list and total value display
    updateInvestmentList();
    updateTotalValue();
    updateChart();

    // Clear the form fields
    document.getElementById('investmentForm').reset();
});

// Function to calculate percentage change
function calculatePercentageChange(investmentAmount, currentValue) {
    return ((currentValue - investmentAmount) / investmentAmount * 100).toFixed(2);
}

// Function to update investment list display
function updateInvestmentList() {
    const investmentList = document.getElementById('investmentList');
    investmentList.innerHTML = ''; // Clear existing list

    investments.forEach((investment, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${investment.assetName}: Invested $${investment.investmentAmount}, Current Value $${investment.currentValue}, 
            Percentage Change ${investment.percentageChange}%
            <button onclick="showUpdateForm(${index})">Update</button>
            <button onclick="removeInvestment(${index})">Remove</button>
        `;
        investmentList.appendChild(listItem);
    });
}

// Show update form for a specific investment
function showUpdateForm(index) {
    const newValue = prompt("Enter the new current value:", investments[index].currentValue);
    if (newValue !== null) {
        updateInvestment(index, parseFloat(newValue));
    }
}

// Update investment current value and recalculate percentage change
function updateInvestment(index, newCurrentValue) {
    const investment = investments[index];
    totalValue -= investment.currentValue; // Subtract old value
    investment.currentValue = newCurrentValue; // Update to new value
    investment.percentageChange = calculatePercentageChange(investment.investmentAmount, newCurrentValue); // Recalculate percentage change
    totalValue += newCurrentValue; // Add new value

    // Update investment list and total value display
    updateInvestmentList();
    updateTotalValue();
    updateChart();
}

// Remove an investment
function removeInvestment(index) {
    const investment = investments[index];
    totalValue -= investment.currentValue; // Subtract the current value from total
    investments.splice(index, 1); // Remove the investment from the array

    // Update investment list and total value display
    updateInvestmentList();
    updateTotalValue();
    updateChart();
}



// Function to update the portfolio chart
function updateChart() {
    const assetLabels = investments.map(investment => investment.assetName);
    const assetValues = investments.map(investment => investment.currentValue);

    if (portfolioChart) {
        portfolioChart.data.labels = assetLabels;
        portfolioChart.data.datasets[0].data = assetValues;
        portfolioChart.update();
    } else {
        const ctx = document.getElementById('portfolioChart').getContext('2d');
        portfolioChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: assetLabels,
                datasets: [{
                    label: 'Asset Distribution',
                    data: assetValues,
                    backgroundColor: assetValues.map(() => getRandomColor()),
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Portfolio Asset Distribution'
                    }
                }
            }
        });
    }
}

// Function to generate random color for chart segments
function getRandomColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
}

// Function to update total value display
function updateTotalValue() {
    document.getElementById('totalValue').textContent = totalValue.toFixed(2);
}

// Other functions for updating and removing investments remain unchanged...
