const Ticket       = require('../../models/ticket')
const { error }    = require('../../hlps')
const Moment       = require('moment')

module.exports = api => {

     api.get('/tickets', (req, res) => {

          Ticket.find( ( err, tickets ) => {
               if ( err ) {
                    error( res, err )
                    return
               }
               res.json( tickets )
          })

     })

     api.post( '/tickets', ( req, res ) => {

          var ticket = new Ticket() 

          ticket.title             = req.body.title 
          ticket.category          = req.body.category 
          ticket.steps             = req.body.steps 
          ticket.created_at        = Moment().unix() 
          ticket.deleted           = req.body.deleted 
          ticket.result            = req.body.result
          ticket.expected          = req.body.expected
          ticket.workaround        = req.body.workaround 
          ticket.repro             = req.body.repro 

          ticket.save( err => {
               if( err ) {
                    error( res, err )
                    return
               }
               res.json( ticket )
          })

     })

     api.put( '/tickets/:_id', ( req, res ) => {

          Ticket.findById( req.params._id, ( err, ticket ) => {

               if( err ) {
                    error( res, err )
                    return
               }

               var ticket = new Ticket() 

               ticket.title             = req.body.title 
               ticket.category          = req.body.category 
               ticket.steps             = req.body.steps 
               ticket.updated_at        = Moment().unix() 
               ticket.deleted           = req.body.deleted 
               ticket.result            = req.body.result
               ticket.expected          = req.body.expected
               ticket.workaround        = req.body.workaround 
               ticket.repro             = req.body.repro 

               ticket.save( err => {
                    if( err ) {
                         error( res, err )
                         return
                    }
                    res.json( ticket )
               })

          })

     })

}