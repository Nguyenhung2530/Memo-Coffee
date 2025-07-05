// Format currency to Vietnamese format
function formatVND(amount) {
  if (!amount) return '0 VND';
  // Convert to number (no multiplication needed)
  const value = parseFloat(amount);
  return new Intl.NumberFormat('vi-VN').format(value) + ' VND';
}

// Mapping functions for Vietnamese display
function mapRole(role) {
  const roleMap = {
    'admin': 'Admin',
    'manager': 'Quản lý', 
    'employee': 'Nhân viên',
    'customer': 'Khách hàng'
  };
  return roleMap[role] || role;
}

function mapSize(size) {
  const sizeMap = {
    'small': 'Nhỏ',
    'medium': 'Vừa',
    'large': 'Lớn'
  };
  return sizeMap[size] || size;
}

function mapStatus(status) {
  if (!status) return '';
  
  const statusMap = {
    'active': 'Hoạt động',
    'inactive': 'Không hoạt động',
    'pending': 'Chờ xử lý',
    'preparing': 'Đang chuẩn bị',
    'delivering': 'Đang giao hàng',
    'completed': 'Hoàn thành',
    'delivered': 'Đã giao',
    'cancelled': 'Đã hủy',
    'paid': 'Đã thanh toán',
    'unpaid': 'Chưa thanh toán',
    // Handle Vietnamese values that might already be in database
    'đang chờ': 'Chờ xử lý',
    'đang chuẩn bị': 'Đang chuẩn bị',
    'đang giao': 'Đang giao hàng',
    'đã giao': 'Đã giao',
    'đã hủy': 'Đã hủy',
    'hoàn thành': 'Hoàn thành',
    'chưa thanh toán': 'Chưa thanh toán',
    'đã thanh toán': 'Đã thanh toán'
  };
  
  // Try exact match first
  if (statusMap[status.toLowerCase()]) {
    return statusMap[status.toLowerCase()];
  }
  
  // Return original if no mapping found
  return status;
}

function mapShiftType(shiftType) {
  const shiftMap = {
    'morning': 'Ca sáng',
    'day': 'Ca ngày', 
    'evening': 'Ca chiều',
    'night': 'Ca đêm',
    'normal': 'Bình thường',
    'overtime': 'Tăng ca',
    'holiday': 'Ngày lễ'
  };
  return shiftMap[shiftType] || shiftType;
}

function mapCategory(category) {
  const categoryMap = {
    'coffee': 'Cà phê',
    'tea': 'Trà',
    'juice': 'Nước ép',
    'smoothie': 'Sinh tố',
    'pastry': 'Bánh ngọt',
    'snack': 'Đồ ăn nhẹ'
  };
  return categoryMap[category] || category;
}

function mapPaymentMethod(method) {
  if (!method) return '';
  
  const methodMap = {
    'cash': 'Tiền mặt',
    'credit_card': 'Thẻ tín dụng',
    'debit_card': 'Thẻ ghi nợ',
    'card': 'Thẻ',
    'bank_transfer': 'Chuyển khoản',
    'transfer': 'Chuyển khoản',
    'e_wallet': 'Ví điện tử',
    'momo': 'MoMo',
    'zalo_pay': 'ZaloPay',
    'vn_pay': 'VNPay',
    'qr': 'Thanh toán QR',
    // Handle Vietnamese values that might already be in database
    'tiền mặt': 'Tiền mặt',
    'thẻ': 'Thẻ',
    'chuyển khoản': 'Chuyển khoản',
    'ví điện tử': 'Ví điện tử'
  };
  
  // Try exact match first (case insensitive)
  if (methodMap[method.toLowerCase()]) {
    return methodMap[method.toLowerCase()];
  }
  
  // Return original if no mapping found
  return method;
}

function mapCustomerType(type) {
  const typeMap = {
    'vip': 'VIP',
    'member': 'Thành viên',
    'online': 'Online'
  };
  return typeMap[type] || type;
}

function mapRegistrationSource(source) {
  const sourceMap = {
    'store': 'Tại cửa hàng',
    'online': 'Trực tuyến',
    'app': 'Ứng dụng'
  };
  return sourceMap[source] || source;
}

// Customer selection handlers
function handleCustomerSelect(selectElement) {
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const customerName = selectedOption.getAttribute('data-name');
  const customerPhone = selectedOption.getAttribute('data-phone');
  
  const nameField = document.getElementById('invoiceCustomerName');
  const phoneField = document.getElementById('invoiceCustomerPhone');
  
  if (selectElement.value) {
    // Selected a member customer
    nameField.value = customerName || '';
    phoneField.value = customerPhone || '';
    nameField.setAttribute('readonly', true);
    phoneField.setAttribute('readonly', true);
  } else {
    // Selected guest customer
    nameField.value = '';
    phoneField.value = '';
    nameField.removeAttribute('readonly');
    phoneField.removeAttribute('readonly');
  }
}

function handleOrderCustomerSelect(selectElement) {
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const customerName = selectedOption.getAttribute('data-name');
  const customerPhone = selectedOption.getAttribute('data-phone');
  
  const nameField = document.getElementById('orderCustomerName');
  const phoneField = document.getElementById('orderCustomerPhone');
  
  if (selectElement.value) {
    // Selected a member customer
    nameField.value = customerName || '';
    phoneField.value = customerPhone || '';
    nameField.setAttribute('readonly', true);
    phoneField.setAttribute('readonly', true);
  } else {
    // Selected guest customer
    nameField.value = '';
    phoneField.value = '';
    nameField.removeAttribute('readonly');
    phoneField.removeAttribute('readonly');
  }
}

// Quick customer search function
function searchCustomerByPhone() {
  const phone = prompt('Nhập số điện thoại khách hàng:');
  if (!phone) return;
  
  fetch(`api/customers.php?phone=${encodeURIComponent(phone)}`)
    .then(response => response.json())
    .then(customer => {
      if (customer && customer.customer_id) {
        showSuccess(`Tìm thấy: ${customer.name} (${mapCustomerType(customer.customer_type)}) - ${customer.loyalty_points} điểm`);
        
        // Auto-fill if invoice modal is open
        const invoiceModal = document.getElementById('invoiceModal');
        if (invoiceModal.style.display === 'block') {
          document.getElementById('invoiceCustomerId').value = customer.customer_id;
          document.getElementById('invoiceCustomerName').value = customer.name;
          document.getElementById('invoiceCustomerPhone').value = customer.phone;
        }
      } else {
        showWarning('Không tìm thấy khách hàng với số điện thoại này');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showError('Có lỗi xảy ra khi tìm kiếm khách hàng');
    });
}

// Navigation
function initNavigation() {
  // Setup sidebar navigation
  setupNavigationHandlers('.sidebar-menu a')
}

// Common function to update all navigation active states
function updateAllNavigationStates(activeSection) {
  // Update all navigation types
  const allNavSelectors = [
    '.sidebar-menu a',
    '.mobile-nav-menu a', 
    '.bottom-nav-item'
  ];
  
  allNavSelectors.forEach(selector => {
    const navItems = document.querySelectorAll(selector);
    navItems.forEach(item => {
      item.classList.remove('active');
      // Check both data-section attribute and href for compatibility
      const sectionId = item.getAttribute('data-section') || item.getAttribute('href')?.replace('#', '');
      if (sectionId === activeSection) {
        item.classList.add('active');
      }
    });
  });
  
  // Update sections
  const sections = document.querySelectorAll(".section");
  sections.forEach(s => s.classList.remove("active"));
  
  const activeSectionEl = document.getElementById(activeSection);
  if (activeSectionEl) {
    activeSectionEl.classList.add("active");
  }
}

// Load section data
function loadSectionData(sectionId) {
  switch (sectionId) {
    case "overview":
      updateOverviewStats()
      updateDashboardData()
      break
    case "users":
      loadUsersTable()
      break
    case "employees":
      loadEmployeesTable()
      break
    case "shifts":
      loadShiftsTable()
      populateEmployeeSelects()
      break
    case "drinks":
      loadDrinksTable()
      break
    case "recipes":
      loadRecipesTable()
      populateDrinkSelects()
      break
    case "ingredients":
      loadIngredientsTable()
      break
    case "invoices":
      loadInvoicesTable()
      populateEmployeeSelects()
      populateCustomerSelects()
      break
    case "customers":
      loadCustomersTable()
      break
    case "orders":
      loadOrdersTable()
      break
  }
}

// Modal functions
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block"
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
  // Reset form
  const form = document.querySelector(`#${modalId} form`)
  if (form) {
    form.reset()
    // Clear hidden ID fields
    const idField = form.querySelector('input[type="hidden"]')
    if (idField) idField.value = ""
  }
}

// Form submissions
function initForms() {
  // User form
  const userForm = document.getElementById("userForm");
  if (userForm) {
    userForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const userId = document.getElementById("userId").value

    const userData = {
      user_id: userId,
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      role: document.getElementById("role").value,
      status: document.getElementById("status").value,
    }

    const method = userId ? 'PUT' : 'POST';
    
    fetch('api/users.php', {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
                        showSuccess(userId ? 'Cập nhật tài khoản thành công!' : 'Thêm tài khoản thành công!');
        loadUsersTable();
        closeModal('userModal');
      } else {
        showError('Lưu thông tin thất bại!');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showError('Có lỗi xảy ra khi lưu thông tin!');
    });
    });
  }

  // Employee form
  document.getElementById("employeeForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const employeeId = document.getElementById("employeeId").value

    const employeeData = {
      employee_id: employeeId,
      full_name: document.getElementById("fullName").value,
      birth_date: document.getElementById("birthDate").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      position: document.getElementById("position").value,
      hire_date: document.getElementById("hireDate").value,
      address: document.getElementById("address").value,
      salary: Number.parseFloat(document.getElementById("salary").value) || 0,
    }

    const method = employeeId ? 'PUT' : 'POST';
    
    fetch('api/employees.php', {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showSuccess(employeeId ? 'Cập nhật nhân viên thành công!' : 'Thêm nhân viên thành công!');
        loadEmployeesTable();
        closeModal('employeeModal');
      } else {
        showError('Lưu thông tin thất bại!');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showError('Có lỗi xảy ra khi lưu thông tin!');
    });
  })

  // Shift form
  document.getElementById("shiftForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const shiftId = document.getElementById("shiftId").value

    const shiftData = {
      shift_id: shiftId,
      employee_id: Number.parseInt(document.getElementById("shiftEmployeeId").value),
      date: document.getElementById("shiftDate").value,
      start_time: document.getElementById("startTime").value,
      end_time: document.getElementById("endTime").value,
      shift_type: document.getElementById("shiftType").value,
      note: document.getElementById("shiftNote").value,
    }

    const method = shiftId ? 'PUT' : 'POST';
    
    fetch('api/shifts.php', {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shiftData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showSuccess(shiftId ? 'Cập nhật ca làm việc thành công!' : 'Thêm ca làm việc thành công!');
        loadShiftsTable();
        closeModal('shiftModal');
      } else {
        alert('Lưu thông tin thất bại!');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi lưu thông tin!');
    });
  })

  // Drink form
  document.getElementById("drinkForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const drinkId = document.getElementById("drinkId").value

    const drinkData = {
      drink_id: drinkId,
      name: document.getElementById("drinkName").value,
      category: document.getElementById("category").value,
      price: Number.parseFloat(document.getElementById("price").value),
      size: document.getElementById("size").value,
      description: document.getElementById("description").value,
      is_available: document.getElementById("isAvailable").checked,
    }

    const method = drinkId ? 'PUT' : 'POST';
    
    fetch('api/drinks.php', {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(drinkData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showSuccess(drinkId ? 'Cập nhật thức uống thành công!' : 'Thêm thức uống thành công!');
        loadDrinksTable();
        closeModal('drinkModal');
      } else {
        alert('Lưu thông tin thất bại!');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi lưu thông tin!');
    });
  })

  // Recipe form
  document.getElementById("recipeForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const recipeId = document.getElementById("recipeId").value

    const recipeData = {
      recipe_id: recipeId,
      drink_id: Number.parseInt(document.getElementById("recipeDrinkId").value),
      preparation_time: Number.parseInt(document.getElementById("preparationTime").value) || 0,
      steps: document.getElementById("steps").value,
    }

    const method = recipeId ? 'PUT' : 'POST';
    
    fetch('api/recipes.php', {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showSuccess(recipeId ? 'Cập nhật công thức thành công!' : 'Thêm công thức thành công!');
        loadRecipesTable();
        closeModal('recipeModal');
      } else {
        alert('Lưu thông tin thất bại!');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi lưu thông tin!');
    });
  })

  // Ingredient form
  document.getElementById("ingredientForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const ingredientId = document.getElementById("ingredientId").value

    const ingredientData = {
      ingredient_id: ingredientId,
      name: document.getElementById("ingredientName").value,
      unit: document.getElementById("unit").value,
      quantity_in_stock: Number.parseFloat(document.getElementById("quantityInStock").value) || 0,
      supplier: document.getElementById("supplier").value,
    }

    const method = ingredientId ? 'PUT' : 'POST';
    
    fetch('api/ingredients.php', {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingredientData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showSuccess(ingredientId ? 'Cập nhật nguyên liệu thành công!' : 'Thêm nguyên liệu thành công!');
        loadIngredientsTable();
        closeModal('ingredientModal');
      } else {
        alert('Lưu thông tin thất bại!');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi lưu thông tin!');
    });
  })

  // Invoice form
  document.getElementById("invoiceForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const invoiceId = document.getElementById("invoiceId").value
    const customerId = document.getElementById("invoiceCustomerId").value

    const invoiceData = {
      invoice_id: invoiceId,
      employee_id: Number.parseInt(document.getElementById("invoiceEmployeeId").value),
      customer_id: customerId ? Number.parseInt(customerId) : null,
      customer_name: document.getElementById("invoiceCustomerName").value,
      customer_phone: document.getElementById("invoiceCustomerPhone").value,
      total_amount: Number.parseFloat(document.getElementById("totalAmount").value),
      discount: Number.parseFloat(document.getElementById("discount").value) || 0,
      payment_method: document.getElementById("paymentMethod").value,
      invoice_type: document.getElementById("invoiceType").value,
    }

    const method = invoiceId ? 'PUT' : 'POST';
    
    fetch('api/invoices.php', {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showSuccess(invoiceId ? 'Cập nhật hóa đơn thành công!' : 'Thêm hóa đơn thành công!');
        loadInvoicesTable();
        closeModal('invoiceModal');
      } else {
        showError('Lưu thông tin thất bại!');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showError('Có lỗi xảy ra khi lưu thông tin!');
    });
  })

  // Customer form
  document.getElementById("customerForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const customerId = document.getElementById("customerId").value

    const customerData = {
      customer_id: customerId,
      name: document.getElementById("customerName").value,
      phone: document.getElementById("customerPhone").value,
      email: document.getElementById("customerEmail").value,
      date_of_birth: document.getElementById("dateOfBirth").value,
      loyalty_points: Number.parseInt(document.getElementById("loyaltyPoints").value) || 0,
      customer_type: document.getElementById("customerType").value,
      registration_source: document.getElementById("registrationSource").value,
      status: document.getElementById("customerStatus").value,
    }

    const method = customerId ? 'PUT' : 'POST';
    
    fetch('api/customers.php', {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showSuccess(customerId ? 'Cập nhật khách hàng thành viên thành công!' : 'Thêm khách hàng thành viên thành công!');
        loadCustomersTable();
        populateCustomerSelects(); // Refresh customer selects
        closeModal('customerModal');
      } else {
        showError('Lưu thông tin thất bại!');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showError('Có lỗi xảy ra khi lưu thông tin!');
    });
  })

  // Order form
  document.getElementById("orderForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const orderId = document.getElementById("orderId").value
    const customerId = document.getElementById("orderCustomerId").value

    const orderData = {
      order_id: orderId,
      customer_id: customerId || null,
      customer_name: document.getElementById("orderCustomerName").value,
      customer_phone: document.getElementById("orderCustomerPhone").value,
      delivery_address: document.getElementById("deliveryAddress").value,
      total_amount: Number.parseFloat(document.getElementById("orderTotalAmount").value) || 0,
      order_note: document.getElementById("orderNote").value,
      status: document.getElementById("orderStatus").value,
      payment_status: document.getElementById("paymentStatus").value,
    }

    const method = orderId ? 'PUT' : 'POST';
    
    fetch('api/orders.php', {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showSuccess(orderId ? 'Cập nhật đơn hàng online thành công!' : 'Thêm đơn hàng online thành công!');
        loadOrdersTable();
        closeModal('orderModal');
      } else {
        showError('Lưu thông tin thất bại!');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showError('Có lỗi xảy ra khi lưu thông tin!');
    });
  })


}

// Update overview statistics
async function updateOverviewStats() {
  // Stats cards removed, no longer needed
}

// Update dashboard data
async function updateDashboardData() {
  try {
    // Update revenue data
    await updateRevenueData()
    
    // Update employee summary
    await updateEmployeeSummary()
    
    // Update drinks summary
    await updateDrinksSummary()
    
    // Update revenue summary
    await updateRevenueSummary()
    
    // Update recent activities
    updateRecentActivities()
    
  } catch (error) {
    console.error('Error updating dashboard data:', error)
  }
}

// Update revenue data
async function updateRevenueData() {
  try {
    const invoicesResponse = await fetch('api/invoices.php')
    const invoices = await invoicesResponse.json()
    
    const ordersResponse = await fetch('api/orders.php')
    const orders = await ordersResponse.json()
    
    const customersResponse = await fetch('api/customers.php')
    const customers = await customersResponse.json()
    
    // Calculate today's revenue
    const today = new Date().toISOString().split('T')[0]
    const todayInvoices = invoices.filter(inv => 
      inv.timestamp && inv.timestamp.startsWith(today)
    )
    const todayRevenue = todayInvoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0)
    
    document.getElementById('today-revenue').textContent = formatVND(todayRevenue)
    
    // Update orders count
    const todayOrders = orders.filter(order => 
      order.order_time && order.order_time.startsWith(today)
    )
    document.getElementById('total-orders').textContent = orders.length
    document.getElementById('orders-change').textContent = `+${todayOrders.length}`
    
    // VIP customers (high loyalty points)
    const vipCustomers = customers.filter(c => (c.loyalty_points || 0) > 100)
    document.getElementById('vip-customers').textContent = vipCustomers.length
    
  } catch (error) {
    console.error('Error updating revenue data:', error)
  }
}

// Update employee summary
async function updateEmployeeSummary() {
  try {
    const employeesResponse = await fetch('api/employees.php')
    const employees = await employeesResponse.json()
    
    const managerCount = employees.filter(emp => 
      (emp.position || '').toLowerCase().includes('quản lý') || 
      (emp.position || '').toLowerCase().includes('manager')
    ).length
    
    const regularCount = employees.length - managerCount
    const totalSalary = employees.reduce((sum, emp) => sum + parseFloat(emp.salary || 0), 0)
    
    document.getElementById('fulltime-employees').textContent = managerCount
    document.getElementById('parttime-employees').textContent = regularCount
    document.getElementById('total-salary').textContent = formatVND(totalSalary)
    
  } catch (error) {
    console.error('Error updating employee summary:', error)
  }
}

// Update drinks summary
async function updateDrinksSummary() {
  try {
    const drinksResponse = await fetch('api/drinks.php')
    const drinks = await drinksResponse.json()
    
    const coffeeCount = drinks.filter(d => 
      (d.category || '').toLowerCase().includes('coffee') || 
      (d.category || '').toLowerCase().includes('cà phê')
    ).length
    
    const teaCount = drinks.filter(d => 
      (d.category || '').toLowerCase().includes('tea') || 
      (d.category || '').toLowerCase().includes('trà')
    ).length
    
    const otherCount = drinks.length - coffeeCount - teaCount
    
    document.getElementById('coffee-count').textContent = coffeeCount
    document.getElementById('tea-count').textContent = teaCount
    document.getElementById('other-drinks-count').textContent = otherCount
    
  } catch (error) {
    console.error('Error updating drinks summary:', error)
  }
}

// Update revenue summary
async function updateRevenueSummary() {
  try {
    const invoicesResponse = await fetch('api/invoices.php')
    const invoices = await invoicesResponse.json()
    
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const weekRevenue = invoices
      .filter(inv => new Date(inv.timestamp) >= weekAgo)
      .reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0)
      
    const monthRevenue = invoices
      .filter(inv => new Date(inv.timestamp) >= monthAgo)
      .reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0)
      
    const avgInvoice = invoices.length > 0 ? 
      invoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0) / invoices.length : 0
    
    document.getElementById('week-revenue').textContent = formatVND(weekRevenue)
    document.getElementById('month-revenue').textContent = formatVND(monthRevenue)
    document.getElementById('avg-invoice').textContent = formatVND(avgInvoice)
    
  } catch (error) {
    console.error('Error updating revenue summary:', error)
  }
}

// Update recent activities
function updateRecentActivities() {
  const activities = [
    { icon: 'receipt', text: 'Hóa đơn mới được tạo', time: '2 phút trước' },
    { icon: 'user-plus', text: 'Khách hàng mới đăng ký', time: '15 phút trước' },
    { icon: 'shopping-cart', text: 'Đơn hàng online mới', time: '30 phút trước' },
    { icon: 'mug-hot', text: 'Thức uống mới được thêm', time: '1 giờ trước' },
    { icon: 'users', text: 'Nhân viên mới được tuyển', time: '2 giờ trước' }
  ]
  
  const activityList = document.getElementById('recent-activities')
  if (activityList) {
    activityList.innerHTML = activities.map(activity => `
      <div class="activity-item">
        <div class="activity-icon"><i class="fas fa-${activity.icon}"></i></div>
        <div class="activity-content">
          <p>${activity.text}</p>
          <small>${activity.time}</small>
        </div>
      </div>
    `).join('')
  }
}

// Show summary tab
window.showSummaryTab = function(tabId) {
  // Hide all tabs
  const contents = document.querySelectorAll('.summary-content')
  contents.forEach(content => content.classList.remove('active'))
  
  const buttons = document.querySelectorAll('.tab-btn')
  buttons.forEach(btn => btn.classList.remove('active'))
  
  // Show selected tab
  document.getElementById(tabId).classList.add('active')
  event.target.classList.add('active')
  
  // Load raw data if needed
  if (tabId === 'raw-data') {
    loadRawData()
  }
}

// Load raw data
async function loadRawData() {
  try {
    const [employees, drinks, invoices, customers, orders] = await Promise.all([
      fetch('api/employees.php').then(r => r.json()),
      fetch('api/drinks.php').then(r => r.json()),
      fetch('api/invoices.php').then(r => r.json()),
      fetch('api/customers.php').then(r => r.json()),
      fetch('api/orders.php').then(r => r.json())
    ])
    
    const rawData = {
      employees,
      drinks,
      invoices,
      customers,
      orders,
      timestamp: new Date().toISOString()
    }
    
    document.getElementById('raw-data-display').value = JSON.stringify(rawData, null, 2)
    
  } catch (error) {
    console.error('Error loading raw data:', error)
    document.getElementById('raw-data-display').value = 'Lỗi khi tải dữ liệu: ' + error.message
  }
}

// Export raw data
window.exportRawData = function() {
  const data = document.getElementById('raw-data-display').value
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `memo-coffee-data-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  showSuccess('Dữ liệu đã được xuất thành công!')
}



// Load Users Table
window.loadUsersTable = function() {
    const tbody = document.querySelector('#usersTable tbody');
    
    if (!tbody) {
        console.error('Users table tbody not found!');
        return;
    }
    
    tbody.innerHTML = '<tr><td colspan="7">Đang tải...</td></tr>';
    
    fetch('api/users.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(users => {
            tbody.innerHTML = '';
            
            if (!users || users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7">Không có dữ liệu</td></tr>';
                return;
            }
            
            users.forEach(user => {
                tbody.innerHTML += `
                    <tr>
                        <td>${user.user_id}</td>
                        <td>${user.username}</td>
                        <td>${mapRole(user.role)}</td>
                        <td><span class="status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}">${user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</span></td>
                        <td>${new Date(user.created_at).toLocaleDateString()}</td>
                        <td>${user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Chưa đăng nhập'}</td>
                        <td>
                            <button class="btn btn-edit" onclick="editUser(${user.user_id})">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            <button class="btn btn-delete" onclick="deleteUser(${user.user_id}, '${user.username}')">
                                <i class="fas fa-trash"></i> Xóa
                            </button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => {
            console.error('Error loading users:', error);
            tbody.innerHTML = `<tr><td colspan="7">Lỗi: ${error.message}</td></tr>`;
        });
}

// Load Shifts Table
function loadShiftsTable() {
    fetch('api/shifts.php')
        .then(response => response.json())
        .then(shifts => {
            const tbody = document.querySelector('#shiftsTable tbody');
            tbody.innerHTML = '';
            
            shifts.forEach(shift => {
                tbody.innerHTML += `
                    <tr>
                        <td>${shift.shift_id}</td>
                        <td>${shift.full_name}</td>
                        <td>${shift.date}</td>
                        <td>${shift.start_time}</td>
                        <td>${shift.end_time}</td>
                        <td>${mapShiftType(shift.shift_type)}</td>
                        <td>
                            <button class="btn btn-edit" onclick="editShift(${shift.shift_id})">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            <button class="btn btn-delete" onclick="deleteShift(${shift.shift_id}, 'Ca làm việc #${shift.shift_id}')">
                                <i class="fas fa-trash"></i> Xóa
                            </button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}

// Load Drinks Table
function loadDrinksTable() {
    fetch('api/drinks.php')
        .then(response => response.json())
        .then(drinks => {
            const tbody = document.querySelector('#drinksTable tbody');
            tbody.innerHTML = '';
            
            drinks.forEach(drink => {
                tbody.innerHTML += `
                    <tr>
                        <td>${drink.drink_id}</td>
                        <td>${drink.name}</td>
                                <td>${mapCategory(drink.category)}</td>
        <td>${formatVND(drink.price)}</td>
        <td>${mapSize(drink.size)}</td>
                        <td><span class="status-badge ${drink.is_available ? 'status-available' : 'status-unavailable'}">${drink.is_available ? 'Có sẵn' : 'Hết hàng'}</span></td>
                        <td>
                            <button class="btn btn-edit" onclick="editDrink(${drink.drink_id})">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            <button class="btn btn-delete" onclick="deleteDrink(${drink.drink_id}, '${drink.name}')">
                                <i class="fas fa-trash"></i> Xóa
                            </button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}

// Load Recipes Table
function loadRecipesTable() {
    fetch('api/recipes.php')
        .then(response => response.json())
        .then(recipes => {
            const tbody = document.querySelector('#recipesTable tbody');
            tbody.innerHTML = '';
            
            recipes.forEach(recipe => {
                tbody.innerHTML += `
                    <tr>
                        <td>${recipe.recipe_id}</td>
                        <td>${recipe.drink_name}</td>
                        <td>${recipe.preparation_time} phút</td>
                        <td>${recipe.steps ? recipe.steps.substring(0, 100) + '...' : 'Chưa có'}</td>
                        <td>
                            <button class="btn btn-edit" onclick="editRecipe(${recipe.recipe_id})">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            <button class="btn btn-delete" onclick="deleteRecipe(${recipe.recipe_id}, 'Công thức #${recipe.recipe_id}')">
                                <i class="fas fa-trash"></i> Xóa
                            </button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}

// Load Ingredients Table
function loadIngredientsTable() {
    fetch('api/ingredients.php')
        .then(response => response.json())
        .then(ingredients => {
            const tbody = document.querySelector('#ingredientsTable tbody');
            tbody.innerHTML = '';
            
            ingredients.forEach(ingredient => {
                tbody.innerHTML += `
                    <tr>
                        <td>${ingredient.ingredient_id}</td>
                        <td>${ingredient.name}</td>
                        <td>${ingredient.unit}</td>
                        <td>${ingredient.quantity_in_stock}</td>
                        <td>${ingredient.supplier}</td>
                        <td>${new Date(ingredient.last_updated).toLocaleDateString()}</td>
                        <td>
                            <button class="btn btn-edit" onclick="editIngredient(${ingredient.ingredient_id})">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            <button class="btn btn-delete" onclick="deleteIngredient(${ingredient.ingredient_id}, '${ingredient.name}')">
                                <i class="fas fa-trash"></i> Xóa
                            </button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}

// Load Invoices Table
function loadInvoicesTable() {
    fetch('api/invoices.php')
        .then(response => response.json())
        .then(invoices => {
            const tbody = document.querySelector('#invoicesTable tbody');
            tbody.innerHTML = '';
            
            invoices.forEach(invoice => {
                const customerDisplay = invoice.customer_id ? 
                    `${invoice.customer_name} <span class="status-badge status-${invoice.customer_type || 'member'}" style="font-size: 0.7rem; margin-left: 5px;">${mapCustomerType(invoice.customer_type)}</span>` : 
                    invoice.customer_name || 'Khách lẻ';
                    
                tbody.innerHTML += `
                    <tr>
                        <td>${invoice.invoice_id}</td>
                        <td>${invoice.employee_name}</td>
                        <td>${customerDisplay}</td>
                        <td>${invoice.customer_phone || ''}</td>
                        <td>${formatVND(invoice.total_amount)}</td>
                        <td>${formatVND(invoice.discount)}</td>
                        <td>${mapPaymentMethod(invoice.payment_method)}</td>
                        <td><span class="status-badge status-${invoice.invoice_type}">${invoice.invoice_type === 'store' ? 'Tại cửa hàng' : 'Online'}</span></td>
                        <td>${new Date(invoice.timestamp).toLocaleString()}</td>
                        <td>
                            <button class="btn btn-edit" onclick="editInvoice(${invoice.invoice_id})">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            <button class="btn btn-delete" onclick="deleteInvoice(${invoice.invoice_id}, 'Hóa đơn #${invoice.invoice_id}')">
                                <i class="fas fa-trash"></i> Xóa
                            </button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}

// Load Customers Table
function loadCustomersTable() {
    fetch('api/customers.php')
        .then(response => response.json())
        .then(customers => {
            const tbody = document.querySelector('#customersTable tbody');
            tbody.innerHTML = '';
            
            customers.forEach(customer => {
                tbody.innerHTML += `
                    <tr>
                        <td>${customer.customer_id}</td>
                        <td>${customer.name} 
                            <span class="status-badge status-${customer.customer_type}" style="margin-left: 8px; font-size: 0.75rem;">
                                ${mapCustomerType(customer.customer_type)}
                            </span>
                        </td>
                        <td>${customer.phone}</td>
                        <td>${customer.email}</td>
                        <td>${customer.date_of_birth ? new Date(customer.date_of_birth).toLocaleDateString() : 'Chưa có'}</td>
                        <td>${customer.loyalty_points}</td>
                        <td>${mapRegistrationSource(customer.registration_source)}</td>
                        <td>
                            <span class="status-badge ${customer.status === 'active' ? 'status-active' : 'status-inactive'}">
                                ${customer.status === 'active' ? 'Hoạt động' : 'Ngưng hoạt động'}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-edit" onclick="editCustomer(${customer.customer_id})">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            <button class="btn btn-delete" onclick="deleteCustomer(${customer.customer_id}, '${customer.name}')">
                                <i class="fas fa-trash"></i> Xóa
                            </button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}

// Load Orders Table
function loadOrdersTable() {
    fetch('api/orders.php')
        .then(response => response.json())
        .then(orders => {
            const tbody = document.querySelector('#ordersTable tbody');
            tbody.innerHTML = '';
            
            orders.forEach(order => {
                tbody.innerHTML += `
                    <tr>
                        <td>${order.order_id}</td>
                        <td>${order.customer_name || 'Chưa có'}</td>
                        <td>${order.customer_phone || 'Chưa có'}</td>
                        <td>${order.delivery_address || 'Chưa có'}</td>
                        <td>${order.total_amount ? formatVND(order.total_amount) : 'Chưa có'}</td>
                        <td><span class="status-badge">${mapStatus(order.status)}</span></td>
                        <td><span class="status-badge">${mapStatus(order.payment_status)}</span></td>
                        <td>${new Date(order.order_time).toLocaleString()}</td>
                        <td>
                            <button class="btn btn-edit" onclick="editOrder(${order.order_id})">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            <button class="btn btn-delete" onclick="deleteOrder(${order.order_id}, 'Đơn hàng #${order.order_id}')">
                                <i class="fas fa-trash"></i> Xóa
                            </button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}



function populateEmployeeSelects() {
  fetch('api/employees.php')
    .then(response => response.json())
    .then(employees => {
      const shiftEmployeeSelect = document.getElementById('shiftEmployeeId');
      const invoiceEmployeeSelect = document.getElementById('invoiceEmployeeId');
      
      if (shiftEmployeeSelect) {
        shiftEmployeeSelect.innerHTML = '<option value="">Chọn nhân viên</option>';
        employees.forEach(emp => {
          shiftEmployeeSelect.innerHTML += `<option value="${emp.employee_id}">${emp.full_name}</option>`;
        });
      }
      
      if (invoiceEmployeeSelect) {
        invoiceEmployeeSelect.innerHTML = '<option value="">Chọn nhân viên</option>';
        employees.forEach(emp => {
          invoiceEmployeeSelect.innerHTML += `<option value="${emp.employee_id}">${emp.full_name}</option>`;
        });
      }
    })
    .catch(error => console.error('Error loading employees:', error));
}

function populateCustomerSelects() {
  fetch('api/customers.php')
    .then(response => response.json())
    .then(customers => {
      const invoiceCustomerSelect = document.getElementById('invoiceCustomerId');
      const orderCustomerSelect = document.getElementById('orderCustomerId');
      
      if (invoiceCustomerSelect) {
        invoiceCustomerSelect.innerHTML = '<option value="">Khách lẻ</option>';
        customers.forEach(customer => {
          invoiceCustomerSelect.innerHTML += `<option value="${customer.customer_id}" data-name="${customer.name}" data-phone="${customer.phone}">${customer.name} (${mapCustomerType(customer.customer_type)} - ${customer.loyalty_points} điểm)</option>`;
        });
      }
      
      if (orderCustomerSelect) {
        orderCustomerSelect.innerHTML = '<option value="">Khách lẻ</option>';
        customers.forEach(customer => {
          orderCustomerSelect.innerHTML += `<option value="${customer.customer_id}" data-name="${customer.name}" data-phone="${customer.phone}">${customer.name} (${mapCustomerType(customer.customer_type)} - ${customer.loyalty_points} điểm)</option>`;
        });
      }
      
    })
    .catch(error => console.error('Error loading customers:', error));
}

function populateDrinkSelects() {
  fetch('api/drinks.php')
    .then(response => response.json())
    .then(drinks => {
      const recipeDrinkSelect = document.getElementById('recipeDrinkId');
      
      if (recipeDrinkSelect) {
        recipeDrinkSelect.innerHTML = '<option value="">Chọn thức uống</option>';
        drinks.forEach(drink => {
          recipeDrinkSelect.innerHTML += `<option value="${drink.drink_id}">${drink.name}</option>`;
        });
      }
    })
    .catch(error => console.error('Error loading drinks:', error));
}

// Make sure loadEmployeesTable is defined
function loadEmployeesTable() {
    fetch('api/employees.php')
        .then(response => response.json())
        .then(employees => {
            const tbody = document.querySelector('#employeesTable tbody');
            tbody.innerHTML = '';
            
            employees.forEach(emp => {
                tbody.innerHTML += `
                    <tr>
                        <td>${emp.employee_id}</td>
                        <td>${emp.full_name}</td>
                        <td>${emp.phone}</td>
                        <td>${emp.email}</td>
                        <td>${emp.position}</td>
                        <td>${formatVND(emp.salary)}</td>
                        <td>
                                                    <button class="btn btn-edit" onclick="editEmployee(${emp.employee_id})">
                            <i class="fas fa-edit"></i> Sửa
                        </button>
                        <button class="btn btn-delete" onclick="deleteEmployee(${emp.employee_id}, '${emp.full_name}')">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}



function editEmployee(employeeId) {
    // Lấy thông tin nhân viên cụ thể từ server
    fetch(`api/employees.php?id=${employeeId}`)
        .then(response => response.json())
        .then(employee => {
            if (employee) {
                // Sử dụng đúng ID từ HTML
                document.getElementById('employeeId').value = employee.employee_id;
                document.getElementById('fullName').value = employee.full_name || '';
                document.getElementById('birthDate').value = employee.birth_date || '';
                document.getElementById('phone').value = employee.phone || '';
                document.getElementById('email').value = employee.email || '';
                document.getElementById('position').value = employee.position || '';
                document.getElementById('hireDate').value = employee.hire_date || '';
                document.getElementById('address').value = employee.address || '';
                document.getElementById('salary').value = employee.salary || '';
                
                openModal('employeeModal');
            } else {
                showError('Không tìm thấy thông tin nhân viên!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Có lỗi xảy ra khi tải thông tin nhân viên!');
        });
}

function deleteEmployee(employeeId, employeeName = 'nhân viên này') {
    confirmDelete(employeeName, 'Nhân viên', function() {
        // Show loading state
        const deleteBtn = document.querySelector(`button[onclick*="deleteEmployee(${employeeId}"]`);
        if (deleteBtn) {
            deleteBtn.classList.add('loading');
            deleteBtn.disabled = true;
        }

        fetch('api/employees.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ employee_id: employeeId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('Xóa nhân viên thành công!');
                loadEmployeesTable();
            } else {
                showError('Xóa nhân viên thất bại!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Có lỗi xảy ra khi xóa nhân viên!');
        })
        .finally(() => {
            // Remove loading state
            if (deleteBtn) {
                deleteBtn.classList.remove('loading');
                deleteBtn.disabled = false;
            }
        });
    });
}

function deleteUser(userId, userName = 'tài khoản này') {
    confirmDelete(userName, 'Tài khoản', function() {
        // Show loading state
        const deleteBtn = document.querySelector(`button[onclick*="deleteUser(${userId}"]`);
        if (deleteBtn) {
            deleteBtn.classList.add('loading');
            deleteBtn.disabled = true;
        }

        fetch('api/users.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('Xóa tài khoản thành công!');
                loadUsersTable();
            } else {
                showError('Xóa tài khoản thất bại!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Có lỗi xảy ra khi xóa tài khoản!');
        })
        .finally(() => {
            // Remove loading state
            if (deleteBtn) {
                deleteBtn.classList.remove('loading');
                deleteBtn.disabled = false;
            }
        });
    });
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
    // Reset form khi đóng modal
    const form = document.querySelector(`#${modalId} form`);
    if (form) {
        form.reset();
        // Clear hidden ID fields
        const idField = form.querySelector('input[type="hidden"]');
        if (idField) idField.value = "";
    }
    
    // Reset password label nếu là userModal
    if (modalId === 'userModal') {
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.required = true;
            const passwordLabel = passwordInput.previousElementSibling;
            if (passwordLabel && passwordLabel.tagName === 'LABEL') {
                passwordLabel.textContent = 'Mật khẩu:';
            }
        }
    }
}

// Employee form submit handler sẽ được xử lý trong initForms()

// SHIFTS FUNCTIONS
function editShift(shiftId) {
    fetch(`api/shifts.php?id=${shiftId}`)
        .then(response => response.json())
        .then(shift => {
            if (shift) {
                document.getElementById('shiftId').value = shift.shift_id;
                document.getElementById('shiftEmployeeId').value = shift.employee_id;
                document.getElementById('shiftDate').value = shift.date;
                document.getElementById('startTime').value = shift.start_time;
                document.getElementById('endTime').value = shift.end_time;
                document.getElementById('shiftType').value = shift.shift_type;
                document.getElementById('shiftNote').value = shift.note || '';
                
                openModal('shiftModal');
            } else {
                alert('Không tìm thấy thông tin ca làm việc!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi tải thông tin ca làm việc!');
        });
}

function deleteShift(shiftId, shiftInfo = 'ca làm việc này') {
    confirmDelete(shiftInfo, 'Ca làm việc', function() {
        const deleteBtn = document.querySelector(`button[onclick*="deleteShift(${shiftId}"]`);
        if (deleteBtn) {
            deleteBtn.classList.add('loading');
            deleteBtn.disabled = true;
        }

        fetch('api/shifts.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ shift_id: shiftId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('Xóa ca làm việc thành công!');
                loadShiftsTable();
            } else {
                showError('Xóa ca làm việc thất bại!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Có lỗi xảy ra khi xóa ca làm việc!');
        })
        .finally(() => {
            if (deleteBtn) {
                deleteBtn.classList.remove('loading');
                deleteBtn.disabled = false;
            }
        });
    });
}

// DRINKS FUNCTIONS
function editDrink(drinkId) {
    fetch(`api/drinks.php?id=${drinkId}`)
        .then(response => response.json())
        .then(drink => {
            if (drink) {
                document.getElementById('drinkId').value = drink.drink_id;
                document.getElementById('drinkName').value = drink.name;
                document.getElementById('category').value = drink.category;
                document.getElementById('price').value = drink.price;
                document.getElementById('size').value = drink.size;
                document.getElementById('description').value = drink.description || '';
                document.getElementById('isAvailable').checked = drink.is_available;
                
                openModal('drinkModal');
            } else {
                alert('Không tìm thấy thông tin thức uống!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi tải thông tin thức uống!');
        });
}

function deleteDrink(drinkId, drinkName = 'thức uống này') {
    confirmDelete(drinkName, 'Thức uống', function() {
        const deleteBtn = document.querySelector(`button[onclick*="deleteDrink(${drinkId}"]`);
        if (deleteBtn) {
            deleteBtn.classList.add('loading');
            deleteBtn.disabled = true;
        }

        fetch('api/drinks.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ drink_id: drinkId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('Xóa thức uống thành công!');
                loadDrinksTable();
            } else {
                showError('Xóa thức uống thất bại!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Có lỗi xảy ra khi xóa thức uống!');
        })
        .finally(() => {
            if (deleteBtn) {
                deleteBtn.classList.remove('loading');
                deleteBtn.disabled = false;
            }
        });
    });
}

// RECIPES FUNCTIONS
function editRecipe(recipeId) {
    fetch(`api/recipes.php?id=${recipeId}`)
        .then(response => response.json())
        .then(recipe => {
            if (recipe) {
                document.getElementById('recipeId').value = recipe.recipe_id;
                document.getElementById('recipeDrinkId').value = recipe.drink_id;
                document.getElementById('preparationTime').value = recipe.preparation_time || '';
                document.getElementById('steps').value = recipe.steps || '';
                
                openModal('recipeModal');
            } else {
                alert('Không tìm thấy thông tin công thức!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi tải thông tin công thức!');
        });
}

function deleteRecipe(recipeId, recipeName = 'công thức này') {
    confirmDelete(recipeName, 'Công thức', function() {
        const deleteBtn = document.querySelector(`button[onclick*="deleteRecipe(${recipeId}"]`);
        if (deleteBtn) {
            deleteBtn.classList.add('loading');
            deleteBtn.disabled = true;
        }

        fetch('api/recipes.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipe_id: recipeId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('Xóa công thức thành công!');
                loadRecipesTable();
            } else {
                showError('Xóa công thức thất bại!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Có lỗi xảy ra khi xóa công thức!');
        })
        .finally(() => {
            if (deleteBtn) {
                deleteBtn.classList.remove('loading');
                deleteBtn.disabled = false;
            }
        });
    });
}

// INGREDIENTS FUNCTIONS
function editIngredient(ingredientId) {
    fetch(`api/ingredients.php?id=${ingredientId}`)
        .then(response => response.json())
        .then(ingredient => {
            if (ingredient) {
                document.getElementById('ingredientId').value = ingredient.ingredient_id;
                document.getElementById('ingredientName').value = ingredient.name;
                document.getElementById('unit').value = ingredient.unit || '';
                document.getElementById('quantityInStock').value = ingredient.quantity_in_stock;
                document.getElementById('supplier').value = ingredient.supplier || '';
                
                openModal('ingredientModal');
            } else {
                alert('Không tìm thấy thông tin nguyên liệu!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi tải thông tin nguyên liệu!');
        });
}

function deleteIngredient(ingredientId, ingredientName = 'nguyên liệu này') {
    confirmDelete(ingredientName, 'Nguyên liệu', function() {
        const deleteBtn = document.querySelector(`button[onclick*="deleteIngredient(${ingredientId}"]`);
        if (deleteBtn) {
            deleteBtn.classList.add('loading');
            deleteBtn.disabled = true;
        }

        fetch('api/ingredients.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingredient_id: ingredientId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('Xóa nguyên liệu thành công!');
                loadIngredientsTable();
            } else {
                showError('Xóa nguyên liệu thất bại!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Có lỗi xảy ra khi xóa nguyên liệu!');
        })
        .finally(() => {
            if (deleteBtn) {
                deleteBtn.classList.remove('loading');
                deleteBtn.disabled = false;
            }
        });
    });
}

// CUSTOMERS FUNCTIONS
function editCustomer(customerId) {
    fetch(`api/customers.php?id=${customerId}`)
        .then(response => response.json())
        .then(customer => {
            if (customer) {
                document.getElementById('customerId').value = customer.customer_id;
                document.getElementById('customerName').value = customer.name;
                document.getElementById('customerPhone').value = customer.phone;
                document.getElementById('customerEmail').value = customer.email;
                document.getElementById('dateOfBirth').value = customer.date_of_birth || '';
                document.getElementById('loyaltyPoints').value = customer.loyalty_points;
                document.getElementById('customerType').value = customer.customer_type || 'member';
                document.getElementById('registrationSource').value = customer.registration_source || 'store';
                document.getElementById('customerStatus').value = customer.status || 'active';
                
                openModal('customerModal');
            } else {
                showError('Không tìm thấy thông tin khách hàng!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Có lỗi xảy ra khi tải thông tin khách hàng!');
        });
}

function deleteCustomer(customerId, customerName = 'khách hàng này') {
    confirmDelete(customerName, 'Khách hàng', function() {
        const deleteBtn = document.querySelector(`button[onclick*="deleteCustomer(${customerId}"]`);
        if (deleteBtn) {
            deleteBtn.classList.add('loading');
            deleteBtn.disabled = true;
        }

        fetch('api/customers.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ customer_id: customerId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('Xóa khách hàng thành công!');
                loadCustomersTable();
            } else {
                showError('Xóa khách hàng thất bại!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Có lỗi xảy ra khi xóa khách hàng!');
        })
        .finally(() => {
            if (deleteBtn) {
                deleteBtn.classList.remove('loading');
                deleteBtn.disabled = false;
            }
        });
    });
}

// INVOICES FUNCTIONS
function editInvoice(invoiceId) {
    fetch(`api/invoices.php?id=${invoiceId}`)
        .then(response => response.json())
        .then(invoice => {
            if (invoice) {
                document.getElementById('invoiceId').value = invoice.invoice_id;
                document.getElementById('invoiceEmployeeId').value = invoice.employee_id;
                document.getElementById('invoiceCustomerId').value = invoice.customer_id || '';
                document.getElementById('invoiceCustomerName').value = invoice.customer_name || '';
                document.getElementById('invoiceCustomerPhone').value = invoice.customer_phone || '';
                document.getElementById('totalAmount').value = invoice.total_amount;
                document.getElementById('paymentMethod').value = invoice.payment_method;
                document.getElementById('discount').value = invoice.discount;
                document.getElementById('invoiceType').value = invoice.invoice_type || 'store';
                
                // Handle customer selection change
                handleCustomerSelect(document.getElementById('invoiceCustomerId'));
                
                openModal('invoiceModal');
            } else {
                showError('Không tìm thấy thông tin hóa đơn!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Có lỗi xảy ra khi tải thông tin hóa đơn!');
        });
}

function deleteInvoice(invoiceId, invoiceInfo = 'hóa đơn này') {
    confirmDelete(invoiceInfo, 'Hóa đơn', function() {
        const deleteBtn = document.querySelector(`button[onclick*="deleteInvoice(${invoiceId}"]`);
        if (deleteBtn) {
            deleteBtn.classList.add('loading');
            deleteBtn.disabled = true;
        }

        fetch('api/invoices.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ invoice_id: invoiceId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('Xóa hóa đơn thành công!');
                loadInvoicesTable();
            } else {
                showError('Xóa hóa đơn thất bại!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Có lỗi xảy ra khi xóa hóa đơn!');
        })
        .finally(() => {
            if (deleteBtn) {
                deleteBtn.classList.remove('loading');
                deleteBtn.disabled = false;
            }
        });
    });
}

// ORDERS FUNCTIONS
function editOrder(orderId) {
    fetch(`api/orders.php?id=${orderId}`)
        .then(response => response.json())
        .then(order => {
            if (order) {
                document.getElementById('orderId').value = order.order_id;
                document.getElementById('orderCustomerId').value = order.customer_id || '';
                document.getElementById('orderCustomerName').value = order.customer_name || '';
                document.getElementById('orderCustomerPhone').value = order.customer_phone || '';
                document.getElementById('deliveryAddress').value = order.delivery_address || '';
                document.getElementById('orderTotalAmount').value = order.total_amount || '';
                document.getElementById('orderNote').value = order.order_note || '';
                document.getElementById('orderStatus').value = order.status;
                document.getElementById('paymentStatus').value = order.payment_status;
                
                // Handle customer selection change
                handleOrderCustomerSelect(document.getElementById('orderCustomerId'));
                
                openModal('orderModal');
            } else {
                showError('Không tìm thấy thông tin đơn hàng!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Có lỗi xảy ra khi tải thông tin đơn hàng!');
        });
}

function deleteOrder(orderId, orderInfo = 'đơn hàng này') {
    confirmDelete(orderInfo, 'Đơn hàng', function() {
        const deleteBtn = document.querySelector(`button[onclick*="deleteOrder(${orderId}"]`);
        if (deleteBtn) {
            deleteBtn.classList.add('loading');
            deleteBtn.disabled = true;
        }

        fetch('api/orders.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order_id: orderId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('Xóa đơn hàng thành công!');
                loadOrdersTable();
            } else {
                showError('Xóa đơn hàng thất bại!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Có lỗi xảy ra khi xóa đơn hàng!');
        })
        .finally(() => {
            if (deleteBtn) {
                deleteBtn.classList.remove('loading');
                deleteBtn.disabled = false;
            }
        });
    });
}

// USERS FUNCTIONS
window.editUser = function(userId) {
    fetch(`api/users.php?id=${userId}`)
        .then(response => response.json())
        .then(user => {
            if (user) {
                document.getElementById('userId').value = user.user_id;
                document.getElementById('username').value = user.username;
                document.getElementById('password').value = ''; // Không hiển thị password cũ
                document.getElementById('role').value = user.role;
                document.getElementById('status').value = user.status;
                
                // Thay đổi label password khi edit
                const passwordInput = document.getElementById('password');
                if (passwordInput) {
                    passwordInput.required = false;
                    const passwordLabel = passwordInput.previousElementSibling;
                    if (passwordLabel && passwordLabel.tagName === 'LABEL') {
                        passwordLabel.textContent = 'Mật khẩu (để trống nếu không thay đổi):';
                    }
                }
                
                openModal('userModal');
            } else {
                showError('Không tìm thấy thông tin tài khoản!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Có lỗi xảy ra khi tải thông tin tài khoản!');
        });
}

// Sidebar toggle
function initSidebarToggle() {
  const sidebarToggle = document.querySelector(".sidebar-toggle")
  const sidebar = document.querySelector(".sidebar")
  const mainContent = document.querySelector(".main-content")
  const overlay = document.querySelector(".sidebar-overlay")

  if (!sidebarToggle || !sidebar || !mainContent || !overlay) {
    console.error('Sidebar elements not found')
    return
  }

  sidebarToggle.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (window.innerWidth <= 768) {
      // Mobile behavior - use 'active' class
      sidebar.classList.toggle("active")
      overlay.classList.toggle("active", sidebar.classList.contains("active"))
    } else {
      // Desktop behavior - use 'collapsed' class
      sidebar.classList.toggle("collapsed")
      mainContent.classList.toggle("expanded")
      
      // Store state in localStorage
      const isCollapsed = sidebar.classList.contains("collapsed")
      localStorage.setItem("sidebarCollapsed", isCollapsed)
    }
  })

  // Restore sidebar state from localStorage (desktop only)
  if (window.innerWidth > 768) {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState === "true") {
      sidebar.classList.add("collapsed")
      mainContent.classList.add("expanded")
    }
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    // Always hide overlay when resizing
    overlay.classList.remove("active")
    
    if (window.innerWidth > 768) {
      // Desktop mode
      sidebar.classList.remove("active")
      const savedState = localStorage.getItem("sidebarCollapsed")
      if (savedState === "true") {
        sidebar.classList.add("collapsed")
        mainContent.classList.add("expanded")
      } else {
        sidebar.classList.remove("collapsed")
        mainContent.classList.remove("expanded")
      }
    } else {
      // Mobile mode - reset to closed state
      sidebar.classList.remove("collapsed", "active")
      mainContent.classList.remove("expanded")
    }
  })

  // Close sidebar when clicking overlay
  overlay.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.remove("active")
      overlay.classList.remove("active")
      document.body.classList.remove("sidebar-open")
    }
  })

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target) && !overlay.contains(e.target)) {
        sidebar.classList.remove("active")
        overlay.classList.remove("active")
        document.body.classList.remove("sidebar-open")
      }
    }
  })
  
  // Prevent body scroll when sidebar is open
  const originalToggle = sidebarToggle.onclick;
  sidebarToggle.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      if (sidebar.classList.contains("active")) {
        document.body.classList.add("sidebar-open")
      } else {
        document.body.classList.remove("sidebar-open")
      }
    }
  })
  
  // Initialize state - sidebar visible by default
}

// Mobile Navigation Management
let currentNavMode = 'sidebar'; // sidebar, top, bottom

function switchNavigation() {
  const modes = ['sidebar', 'top', 'bottom'];
  const currentIndex = modes.indexOf(currentNavMode);
  const nextIndex = (currentIndex + 1) % modes.length;
  currentNavMode = modes[nextIndex];
  
  updateNavigationMode();
  localStorage.setItem('mobileNavMode', currentNavMode);
  
  showSuccess(`Chuyển sang ${getModeDisplayName(currentNavMode)}`, 'Navigation');
}

function getModeDisplayName(mode) {
  const displayNames = {
    'sidebar': 'Sidebar truyền thống',
    'top': 'Top navigation',
    'bottom': 'Bottom navigation'
  };
  return displayNames[mode] || mode;
}

function updateNavigationMode() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const mobileNav = document.getElementById('mobileNav');
  const bottomNav = document.getElementById('bottomNav');
  const mainContent = document.querySelector('.main-content');
  const content = document.querySelector('.content');
  const header = document.querySelector('.header');
  const navSwitch = document.querySelector('.nav-switch');
  
  // Reset all navigation states
  sidebar.style.display = '';
  overlay.style.display = '';
  mobileNav.style.display = 'none';
  bottomNav.style.display = 'none';
  mainContent.style.marginLeft = '';
  mainContent.style.paddingTop = '';
  content.style.paddingBottom = '';
  header.style.top = '';
  header.style.paddingTop = '';
  
  if (window.innerWidth <= 768) {
    navSwitch.innerHTML = `<i class="fas fa-${getNavIcon()}"></i>`;
    
    switch(currentNavMode) {
      case 'sidebar':
        // Default sidebar behavior
        break;
        
      case 'top':
        sidebar.style.display = 'none';
        overlay.style.display = 'none';
        mobileNav.style.display = 'block';
        mainContent.style.marginLeft = '0';
        mainContent.style.paddingTop = '60px';
        header.style.paddingTop = '60px';
        content.style.paddingBottom = '0';
        break;
        
      case 'bottom':
        sidebar.style.display = 'none';
        overlay.style.display = 'none';
        bottomNav.style.display = 'block';
        mainContent.style.marginLeft = '0';
        content.style.paddingBottom = '80px';
        break;
    }
  } else {
    // Desktop mode - always use sidebar
    navSwitch.style.display = 'none';
  }
}

function getNavIcon() {
  const icons = {
    'sidebar': 'bars',
    'top': 'arrow-up',
    'bottom': 'arrow-down'
  };
  return icons[currentNavMode] || 'bars';
}

function toggleMobileNav() {
  const menu = document.getElementById('mobileNavMenu');
  menu.classList.toggle('active');
}

// Initialize mobile navigation
function initMobileNavigation() {
  // Restore saved navigation mode
  const savedMode = localStorage.getItem('mobileNavMode');
  if (savedMode && ['sidebar', 'top', 'bottom'].includes(savedMode)) {
    currentNavMode = savedMode;
  }
  
  // Setup navigation handlers for all navigation types
  setupNavigationHandlers('.mobile-nav-menu a');
  setupNavigationHandlers('.bottom-nav-item');
  // Note: sidebar navigation is already setup in initNavigation()
  
  // Update navigation mode
  updateNavigationMode();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    updateNavigationMode();
  });
  
  // Close mobile nav menu when clicking outside
  document.addEventListener('click', (e) => {
    const mobileNav = document.getElementById('mobileNav');
    const menu = document.getElementById('mobileNavMenu');
    if (mobileNav && !mobileNav.contains(e.target)) {
      menu.classList.remove('active');
    }
  });
}

function setupNavigationHandlers(selector) {
  document.querySelectorAll(selector).forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      if (section) {
        // Update all navigation states
        updateAllNavigationStates(section);
        
        // Load section data
        loadSectionData(section);
        
        // Close mobile menu if open
        const menu = document.getElementById('mobileNavMenu');
        if (menu) {
          menu.classList.remove('active');
        }
        
        // Close sidebar if mobile
        if (window.innerWidth <= 768) {
          const sidebar = document.querySelector('.sidebar');
          const overlay = document.querySelector('.sidebar-overlay');
          if (sidebar && overlay) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
          }
        }
        
        // Update page title
        const titleMap = {
          'overview': 'Tổng quan',
          'users': 'Quản lý tài khoản',
          'employees': 'Quản lý nhân viên',
          'shifts': 'Quản lý ca làm việc',
          'drinks': 'Quản lý thức uống',
          'recipes': 'Quản lý công thức',
          'ingredients': 'Quản lý nguyên liệu',
          'invoices': 'Quản lý hóa đơn',
          'customers': 'Quản lý khách hàng',
          'orders': 'Quản lý đơn hàng online'
        };
        
        const pageTitle = document.getElementById('page-title');
        if (pageTitle && titleMap[section]) {
          pageTitle.textContent = titleMap[section];
        }
      }
    });
  });
}

// Test notifications (temporary - remove after testing)
window.testNotifications = function() {
  setTimeout(() => showSuccess('Thêm nhân viên thành công!'), 500);
  setTimeout(() => showError('Có lỗi xảy ra khi xóa!'), 3000);
  setTimeout(() => showWarning('Dữ liệu sắp hết hạn!'), 5500);
  setTimeout(() => showInfo('Hệ thống sẽ bảo trì vào 2h sáng'), 8000);
}

// Notification System
let notificationTimer = null;

function showNotification(type, title, message, autoHide = true) {
  const modal = document.getElementById('notificationModal');
  const icon = document.getElementById('notificationIcon');
  const titleEl = document.getElementById('notificationTitle');
  const messageEl = document.getElementById('notificationText');
  const progressBar = document.getElementById('notificationProgress');
  const iconContainer = icon.parentElement;

  // Clear any existing timer
  if (notificationTimer) {
    clearTimeout(notificationTimer);
    notificationTimer = null;
  }

  // Reset classes and progress
  iconContainer.className = 'notification-icon';
  modal.classList.remove('fade-out');
  progressBar.classList.remove('shrink');
  
  // Set content based on type
  switch(type) {
    case 'success':
      iconContainer.classList.add('success');
      icon.className = 'fas fa-check';
      titleEl.textContent = title || 'Thành công';
      break;
    case 'error':
      iconContainer.classList.add('error');
      icon.className = 'fas fa-times';
      titleEl.textContent = title || 'Lỗi';
      break;
    case 'warning':
      iconContainer.classList.add('warning');
      icon.className = 'fas fa-exclamation-triangle';
      titleEl.textContent = title || 'Cảnh báo';
      break;
    case 'info':
      iconContainer.classList.add('info');
      icon.className = 'fas fa-info';
      titleEl.textContent = title || 'Thông tin';
      break;
    default:
      iconContainer.classList.add('info');
      icon.className = 'fas fa-info';
      titleEl.textContent = title || 'Thông báo';
  }

  messageEl.textContent = message;
  
  // Show modal
  modal.style.display = 'block';
  
  // Start progress bar animation immediately
  if (autoHide) {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      progressBar.classList.add('shrink');
    }, 10);
    
    // Auto hide after 1.5 seconds
    notificationTimer = setTimeout(() => {
      closeNotification();
    }, 1500);
    
    // Pause on hover
    const notificationContent = modal.querySelector('.notification-content');
    let timeRemaining = 1500;
    let startTime = Date.now();
    
    notificationContent.addEventListener('mouseenter', () => {
      if (notificationTimer) {
        clearTimeout(notificationTimer);
        timeRemaining = timeRemaining - (Date.now() - startTime);
        progressBar.style.animationPlayState = 'paused';
      }
    });
    
    notificationContent.addEventListener('mouseleave', () => {
      if (timeRemaining > 0) {
        startTime = Date.now();
        progressBar.style.animationPlayState = 'running';
        notificationTimer = setTimeout(() => {
          closeNotification();
        }, timeRemaining);
      }
    });
  }
}

function closeNotification() {
  const modal = document.getElementById('notificationModal');
  const progressBar = document.getElementById('notificationProgress');
  
  // Clear timer if exists
  if (notificationTimer) {
    clearTimeout(notificationTimer);
    notificationTimer = null;
  }
  
  // Start fade out animation
  modal.classList.add('fade-out');
  
  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.remove('fade-out');
    progressBar.classList.remove('shrink');
  }, 500);
}

// Helper functions for different notification types
function showSuccess(message, title) {
  showNotification('success', title, message);
}

function showError(message, title) {
  showNotification('error', title, message);
}

function showWarning(message, title) {
  showNotification('warning', title, message);
}

function showInfo(message, title) {
  showNotification('info', title, message);
}

// Confirmation Modal Functions
let confirmCallback = null;

function showConfirmation(title, message, onConfirm, onCancel = null) {
  // Update title with icon based on action type
  const titleElement = document.getElementById('confirmTitle');
  if (title.includes('Xóa')) {
    titleElement.innerHTML = '<i class="fas fa-trash-alt"></i> ' + title;
  } else {
    titleElement.innerHTML = '<i class="fas fa-shield-alt"></i> ' + title;
  }
  
  document.getElementById('confirmMessage').textContent = message;
  
  confirmCallback = onConfirm;
  
  const modal = document.getElementById('confirmModal');
  modal.style.display = 'block';
  
  // Add animation class after a brief delay
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  
  // Set up confirm button click
  document.getElementById('confirmButton').onclick = function() {
    if (confirmCallback) {
      confirmCallback();
    }
    closeConfirmModal();
  };
  
  // Handle ESC key
  document.addEventListener('keydown', handleConfirmEsc);
}

function closeConfirmModal() {
  const modal = document.getElementById('confirmModal');
  modal.classList.remove('show');
  
  // Wait for animation to finish before hiding
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
  
  confirmCallback = null;
  document.removeEventListener('keydown', handleConfirmEsc);
}

function handleConfirmEsc(event) {
  if (event.key === 'Escape') {
    closeConfirmModal();
  }
}

// Enhanced delete confirmation function
function confirmDelete(itemName, itemType, deleteFunction) {
  const title = `Xóa ${itemType}`;
  const message = `Bạn có chắc chắn muốn xóa ${itemType.toLowerCase()} "${itemName}" không? Hành động này không thể hoàn tác.`;
  
  showConfirmation(title, message, deleteFunction);
}

// Close modal when clicking outside
window.onclick = function(event) {
  const confirmModal = document.getElementById('confirmModal');
  if (event.target === confirmModal) {
    closeConfirmModal();
  }
  
  // Also handle other modals
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  initNavigation()
  initForms()
  initSidebarToggle()
  initMobileNavigation()
  initLogoClick()

  // Show overview section by default and set active states for all navigations
  updateAllNavigationStates('overview');
  
  // Load initial section - show overview by default
  updateOverviewStats()
  
  // Load users section nếu đang ở tab users
  if (window.location.hash === '#users') {
    setTimeout(() => {
      loadUsersTable();
    }, 500);
  }

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none"
    }
  })
})

// Initialize logo click to go to overview
function initLogoClick() {
  const logo = document.getElementById('app-logo')
  if (logo) {
    logo.addEventListener('click', function() {
      // Update all navigation states to overview
      updateAllNavigationStates('overview');
      
      // Update page title
      const pageTitle = document.getElementById("page-title")
      if (pageTitle) {
        pageTitle.textContent = "Tổng quan"
      }
      
      // Load overview data
      updateOverviewStats()
      updateDashboardData()
    })
  }
}
