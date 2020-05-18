*clean architecture{
  functionality{

    - outer layer

    =====================================================

    - expressRouter{
      //defines functionality route with Express nomenclature or another Framework
    }

    =====================================================

    - expressAdapter{
      //defines request abstraction for the route is not dependent on the Framework
    }

    =====================================================
    
    - httpRequest{
      //defines content request abstraction
    }
    
    =================== PRESENTATION ====================
 
    - controller{
      //defines which use cases will be used
    }
    
    ====================== DOMAIN =======================
    
    - useCase{
      //makes an action with the entity
    }
    
    ===================================================== 
    
    - model{
      //represents entity in external world as an object
    }
    
    ======================= INFRA =======================
    
    - repository{
      //abstracts the communication action with a database for use cases
    }
  
  }
}