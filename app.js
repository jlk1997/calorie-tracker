// DOM元素
const foodSearchInput = document.getElementById('food-search');
const searchButton = document.getElementById('search-btn');
const searchResultsContainer = document.getElementById('search-results');
const todayMealsContainer = document.getElementById('today-meals');
const totalCaloriesSpan = document.getElementById('total-calories');

// 模态框元素
const foodDetailModal = document.getElementById('food-detail-modal');
const modalCloseButton = document.querySelector('.close-modal');
const modalFoodName = document.getElementById('modal-food-name');
const modalCalories = document.getElementById('modal-calories');
const modalProtein = document.getElementById('modal-protein');
const modalFat = document.getElementById('modal-fat');
const modalCarbs = document.getElementById('modal-carbs');
const foodAmountInput = document.getElementById('food-amount');
const addToMealButton = document.getElementById('add-to-meal-btn');

// 添加自定义食物元素
const addCustomFoodButton = document.getElementById('add-custom-food-btn');
const addFoodModal = document.getElementById('add-food-modal');
const addFoodForm = document.getElementById('add-food-form');
const closeAddModalButton = document.querySelector('.close-add-modal');
const newFoodNameInput = document.getElementById('new-food-name');
const newFoodCaloriesInput = document.getElementById('new-food-calories');
const newFoodProteinInput = document.getElementById('new-food-protein');
const newFoodFatInput = document.getElementById('new-food-fat');
const newFoodCarbsInput = document.getElementById('new-food-carbs');

// 应用状态
let currentSelectedFood = null;
let todayMeals = JSON.parse(localStorage.getItem('todayMeals')) || [];
let totalCalories = parseInt(localStorage.getItem('totalCalories')) || 0;

// 初始化应用
function initApp() {
    // 显示今日摄入的卡路里总量
    updateTotalCalories();
    
    // 渲染今日食谱
    renderTodayMeals();
    
    // 添加事件监听器
    searchButton.addEventListener('click', handleSearch);
    foodSearchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });
    
    modalCloseButton.addEventListener('click', closeModal);
    addToMealButton.addEventListener('click', addFoodToMeal);
    
    // 添加自定义食物相关事件
    addCustomFoodButton.addEventListener('click', openAddFoodModal);
    closeAddModalButton.addEventListener('click', closeAddFoodModal);
    addFoodForm.addEventListener('submit', handleAddFood);
    
    // 每天0点重置数据
    checkForNewDay();
}

// 处理搜索
function handleSearch() {
    const searchTerm = foodSearchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        searchResultsContainer.innerHTML = '';
        return;
    }
    
    const results = foodsDatabase.filter(food => 
        food.name.toLowerCase().includes(searchTerm)
    );
    
    renderSearchResults(results);
}

// 渲染搜索结果
function renderSearchResults(results) {
    searchResultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<div class="empty-state">没有找到相关食物</div>';
        return;
    }
    
    results.forEach(food => {
        const foodItem = document.createElement('div');
        foodItem.className = 'food-item';
        foodItem.innerHTML = `
            <div class="food-info">
                <div class="food-name">${food.name}</div>
                <div class="food-calories">${food.calories} 卡路里/${food.perUnit}</div>
            </div>
        `;
        
        foodItem.addEventListener('click', () => showFoodDetail(food));
        searchResultsContainer.appendChild(foodItem);
    });
}

// 显示食物详情模态框
function showFoodDetail(food) {
    currentSelectedFood = food;
    
    modalFoodName.textContent = food.name;
    modalCalories.textContent = `${food.calories} 卡路里`;
    modalProtein.textContent = `${food.protein}克`;
    modalFat.textContent = `${food.fat}克`;
    modalCarbs.textContent = `${food.carbs}克`;
    
    foodAmountInput.value = 100;
    
    foodDetailModal.style.display = 'block';
}

// 关闭模态框
function closeModal() {
    foodDetailModal.style.display = 'none';
}

// 添加食物到今日食谱
function addFoodToMeal() {
    if (!currentSelectedFood) return;
    
    const amount = parseInt(foodAmountInput.value);
    
    if (isNaN(amount) || amount <= 0) {
        alert('请输入有效的克数');
        return;
    }
    
    // 计算实际卡路里和营养素
    const ratio = amount / 100;
    const calories = Math.round(currentSelectedFood.calories * ratio);
    const protein = (currentSelectedFood.protein * ratio).toFixed(1);
    const fat = (currentSelectedFood.fat * ratio).toFixed(1);
    const carbs = (currentSelectedFood.carbs * ratio).toFixed(1);
    
    // 创建食谱项
    const mealItem = {
        id: Date.now(), // 用时间戳作为唯一ID
        foodId: currentSelectedFood.id,
        name: currentSelectedFood.name,
        amount: amount,
        calories: calories,
        protein: protein,
        fat: fat,
        carbs: carbs,
        timestamp: new Date().toISOString()
    };
    
    // 添加到今日食谱
    todayMeals.push(mealItem);
    
    // 更新总卡路里
    totalCalories += calories;
    
    // 保存数据
    saveData();
    
    // 渲染今日食谱
    renderTodayMeals();
    
    // 更新总卡路里显示
    updateTotalCalories();
    
    // 关闭模态框
    closeModal();
}

// 渲染今日食谱
function renderTodayMeals() {
    todayMealsContainer.innerHTML = '';
    
    if (todayMeals.length === 0) {
        todayMealsContainer.innerHTML = '<div class="empty-state">今日还没有添加食物</div>';
        return;
    }
    
    todayMeals.forEach(meal => {
        const mealItem = document.createElement('div');
        mealItem.className = 'food-item';
        mealItem.innerHTML = `
            <div class="food-info">
                <div class="food-name">${meal.name}</div>
                <div class="food-calories">${meal.calories} 卡路里</div>
            </div>
            <div class="food-amount">${meal.amount}克</div>
        `;
        
        // 添加删除功能
        mealItem.addEventListener('click', () => {
            if (confirm(`是否要删除 ${meal.amount}克 ${meal.name}?`)) {
                removeMeal(meal.id);
            }
        });
        
        todayMealsContainer.appendChild(mealItem);
    });
}

// 移除食谱项
function removeMeal(id) {
    const mealIndex = todayMeals.findIndex(meal => meal.id === id);
    
    if (mealIndex !== -1) {
        // 减去卡路里
        totalCalories -= todayMeals[mealIndex].calories;
        
        // 从数组中移除
        todayMeals.splice(mealIndex, 1);
        
        // 保存数据
        saveData();
        
        // 更新UI
        renderTodayMeals();
        updateTotalCalories();
    }
}

// 打开添加食物模态框
function openAddFoodModal() {
    // 清空表单
    addFoodForm.reset();
    
    // 显示模态框
    addFoodModal.style.display = 'block';
}

// 关闭添加食物模态框
function closeAddFoodModal() {
    addFoodModal.style.display = 'none';
}

// 处理添加食物
function handleAddFood(event) {
    event.preventDefault();
    
    // 获取表单数据
    const newFood = {
        name: newFoodNameInput.value.trim(),
        calories: parseInt(newFoodCaloriesInput.value),
        protein: parseFloat(newFoodProteinInput.value),
        fat: parseFloat(newFoodFatInput.value),
        carbs: parseFloat(newFoodCarbsInput.value)
    };
    
    // 验证数据
    if (!newFood.name || isNaN(newFood.calories) || isNaN(newFood.protein) || 
        isNaN(newFood.fat) || isNaN(newFood.carbs)) {
        alert('请填写所有字段并确保数值有效');
        return;
    }
    
    // 添加到数据库
    const addedFood = addFoodToDatabase(newFood);
    
    // 显示确认消息
    alert(`成功添加食物: ${addedFood.name}`);
    
    // 关闭模态框
    closeAddFoodModal();
    
    // 清空搜索框并触发新食物的搜索
    foodSearchInput.value = addedFood.name;
    handleSearch();
}

// 更新总卡路里显示
function updateTotalCalories() {
    totalCaloriesSpan.textContent = totalCalories;
}

// 保存数据到localStorage
function saveData() {
    localStorage.setItem('todayMeals', JSON.stringify(todayMeals));
    localStorage.setItem('totalCalories', totalCalories.toString());
    localStorage.setItem('lastSaveDate', new Date().toDateString());
}

// 检查是否是新的一天
function checkForNewDay() {
    const lastSaveDate = localStorage.getItem('lastSaveDate');
    const today = new Date().toDateString();
    
    if (lastSaveDate && lastSaveDate !== today) {
        // 重置数据
        todayMeals = [];
        totalCalories = 0;
        saveData();
    }
}

// 点击页面其他地方关闭模态框
window.addEventListener('click', function(event) {
    if (event.target === foodDetailModal) {
        closeModal();
    } else if (event.target === addFoodModal) {
        closeAddFoodModal();
    }
});

// 初始化应用
document.addEventListener('DOMContentLoaded', initApp); 