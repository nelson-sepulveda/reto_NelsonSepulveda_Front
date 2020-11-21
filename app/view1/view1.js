'use strict';

angular.module('myApp.empleado', ['ngRoute', 'ngMaterial'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/empleado', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl',
    controllerAs: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$http', '$mdToast',function($http, $mdToast) {
  var vm = this;

  vm.empleados = []
  vm.empleadoCreate = {
    nombre: '',
    apellido: '',
    genero: '',
    edad: 0,
    fechaNacimiento: ''
  }
  vm.empleadoDelete = {}
  vm.title = ''
  vm.titleAction = ''

  vm.deleteEmpleado = deleteEmpleadoController
  vm.createEmpleado = createEmpleadoController
  vm.openToModal = openToModalController
  vm.actionEmpleado = actionEmpleadoController
  vm.updateEmpleado = updateEmpleadoController
  vm.openToModalDelete = openToModalDeleteController
  vm.deleteEmpleadoModal = deleteEmpleadoModalController

  init()
  
  function deleteEmpleadoModalController () {
    deleteEmpleadoController(vm.empleadoDelete)
  }

  /**
   * Acciona si se registra un empleado o se actualiza su info
   */
  function actionEmpleadoController() {
    if (vm.empleadoCreate && vm.empleadoCreate._id) {
      updateEmpleadoController()
    } else {
      createEmpleadoController()
    }
  }

  /**
   * Actualiza un empleado
   */
  function updateEmpleadoController() {
    console.log(vm.empleadoCreate)
    const { error, message } = validate()
    console.log(error, message)
    if (error) {
      $mdToast.show(
        $mdToast.simple()
        .position('right bottom')
        .textContent(message)
        .hideDelay(3000))
    } else {
      const request = {
        method: 'PUT',
        url: `http://localhost:3000/api/empleado/${vm.empleadoCreate._id}`,
        data: vm.empleadoCreate
      }
      $http(request).then(function success(response) {
        if (response && response.status === 200) {
          setTimeout(() => {
            $mdToast.show(
              $mdToast.simple()
              .textContent('Actualización Exitosa')
              .hideDelay(3000))
          }, 500);
          init()
        }
        jQuery('#modal-empleado').modal('hide')
      }).catch(function err(error) {
        jQuery('#modal-empleado').modal('hide')
        console.log(error)
      })
    }
  }

  /**
   * Abre modal para registro o actualización de un empleado
   * 
   * @param {*} option la cual carga la info si se registra o se actualiza un empleado
   * @param {*} empleado el cual se carga si la accion es actualizar
   */
  function openToModalController(option, empleado) {
    vm.empleadoCreate = {
      nombre: '',
      apellido: '',
      genero: '',
      edad: 0,
      fechaNacimiento: ''
    }
    if (option === 'registro') {
      vm.title = 'Registrar Empleado'
      vm.titleAction = 'Registrar'
    } else {
      vm.titleAction = 'Actualizar'
      vm.title = 'Editar Empleado'
      vm.empleadoCreate = { ...empleado }
    }
    jQuery('#modal-empleado').modal('show')
  }

  /**
   * Carga la lista de empleados
   */
  function init () {
    var url = 'http://localhost:3000/api/empleado';
    $http({
      method: 'GET',
      url: url
    }).then(function success(response) {
      vm.empleados = response.data
    }).catch(function err(error) {
      console.log(error)
    })
  }

  /**
   * Elimina un empleado de la lista
   * @param {*} empleado 
   */
  function deleteEmpleadoController(empleado) {
    const request = {
      method: 'DELETE',
      url: `http://localhost:3000/api/empleado/${empleado._id}`
    }
    $http(request).then(function success(response) {
      if (response && response.status === 200) {
        setTimeout(() => {
          $mdToast.show(
            $mdToast.simple()
            .position('right bottom')
            .textContent('Eliminación Exitosa')
            .hideDelay(3000))
        }, 1000);
        init()
      }
      jQuery('#modal-delete').modal('hide')
    }).catch(function err(error) {
      console.log(error)
    })
  }

  /**
   * Valida la información de un usuario
   */
  function validate() {
    if (!vm.empleadoCreate.nombre || vm.empleadoCreate.nombre === '') {
      return {
        error: true,
        message: 'Nombre Requerido'
      }
    }
    if (!vm.empleadoCreate.apellido || vm.empleadoCreate.apellido === '') {
      return {
        error: true,
        message: 'Apellido Requerido'
      }
    }
    if (!vm.empleadoCreate.genero || vm.empleadoCreate.genero === '') {
      return {
        error: true,
        message: 'Genero Requerido'
      }
    }
    if (!vm.empleadoCreate.fechaNacimiento || vm.empleadoCreate.fechaNacimiento === '') {
      return {
        error: true,
        message: 'Fecha Nacimiento Requerido'
      }
    }
    if (!vm.empleadoCreate.edad || vm.empleadoCreate.edad === 0) {
      return {
        error: true,
        message: 'Edad Requerido'
      }
    }
    return {
      error: false,
      message: ''
    }
  }

  /**
   * Crea un empleado
   */
  function createEmpleadoController() {
    const { error, message } = validate();
    if (error) {
      $mdToast.show(
        $mdToast.simple()
        .position('right bottom')
        .textContent(message)
        .hideDelay(3000))
    } else {
      vm.empleadoCreate.fechaNacimiento = moment(vm.empleadoCreate.fechaNacimiento).format()
      const request = {
        method: 'POST',
        url: 'http://localhost:3000/api/empleado',
        data: vm.empleadoCreate
      }
      $http(request).then(function success(response) {
        if (response && response.status === 200) {
          vm.createEmpleado = {
            nombre: '',
            apellido: '',
            fechaNacimiento: '',
            genero: '',
            edad: 0
          }
          setTimeout(() => {
            $mdToast.show(
              $mdToast.simple()
              .textContent('Empleado Creado Exitosamente')
              .hideDelay(3000))
          }, 500);
          init()
        }
        jQuery('#modal-empleado').modal('hide')
      }).catch(function err(error) {
        jQuery('#modal-empleado').modal('hide')
        console.log(error)
      })
    }
  }

  function openToModalDeleteController(empleado) {
    vm.empleadoDelete = {}
    vm.empleadoDelete = { ...empleado }
    jQuery('#modal-delete').modal('show')
  }

}]);