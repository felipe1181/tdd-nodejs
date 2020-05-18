*clean architecture{
  functionality{

    - outer layer

    =======================================

    - expressAdapter{
      //defines request abstraction for the route is not dependent on the Framework
    }

    =======================================
    
    - httpRequest{
      //defines content request abstraction
    }
    
    =======================================

    - route{
      //define route
    }     
    
    =======================================

    - controller{
      //defines which use cases will be used
    }
    
    =======================================
    
    - useCase{
      //makes an action with the entity
    }
    
    =======================================
    
    - repository{
      //abstracts the communication action with a database for use cases
    }
  }
}