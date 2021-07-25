## APIs
# 1) List all restaurants that are open at a certain datetime

-> Endpoint : /getOpenedRestaurants?dateTime=dd-mm-yy HH:mm
-> Output: 
	- List of all Restaurants contain he Restaurant id, name, cashbalance,
	- Reponse is compressed, and of type RestaurantData(as defined in data-models directory)

-> Error: if any of the required params missed server returns code 400, and for any server error return code 500


# 2) List top y restaurants that have more or less than x number of dishes within a price range
- For this operation we have one endpoint with different queryParams

-> Endpoint1: /getTopRestaurants?top=y&&greaterThan=x&&fromPrice=lower&&toPrice=higher
	- for fetching the y resturants having more than x number of  dishes with defined price range,
		(where:  y is the no of resturants to return, x lower limit on dish count, lower&higher is the lower and higher value respectively of defined range price)

-> Endpoint2: /get-top-resturants?top=y&&lessThan=x&&fromPrice=lower&&toPrice=higher 
	- for fetching the y resturants having less than x number of dishes with defined price range,
		(where:  y is the no of resturants to return, y upper limit on dish count, lower&higher is the lower and higher value respectively of defined range price)

-> Output: 
	- List of all Restaurants contain the Restaurant id, name, cashbalance, in the descending order of the number of dishes in the resturant falls in defined price range
	- Reponse is compressed, and of type RestaurantData(as defined in data-models directory)

-> Error: if any of the required params missed server returns code 400, and for any server error return code 500

# 3) Search for restaurants or dishes by name, ranked by relevance to search term
- For this operation we have two Endpoint 

-> Endpoint 1: /relevantRestaurants?searchTerm=seearchString
		- To get resturants list on the basis of search term, i.e most relevant at top 
		(where searchString is the term on which database is searched)

-> Output: 
	- List of all Restaurants contain he Restaurant id, name, cashbalance
	- Reponse is compressed, and of type RestaurantData(as defined in data-models directory)

-> Endpoint 2: /relevant-dishes?searchTerm=seearchString
		-> To get dishes list on the basis of search term, i.e most relevant at top 
		(where searchString is the term on which database is searched)

-> Output: 
	- List of all Dishes contain he Restaurant name, dishid, dishName, dishPrice
	- Reponse is compressed, and of type RestaurantMenuData(as defined in data-models directory)

-> Error: if any of the required params missed server returns code 400, and for any server error return code 500

# 4) Process a user purchasing a dish from a restaurant, handling all relevant data changes in an atomic transaction

-> Endpoint 1: /place-order/userid/:uid/resturantid/:rid/dishid/:did
	where :
	uid is the userid of the user placing the order,
	rid is the resturant id from which order is placed, 
	did is the dishid for which order is placed,

-> Ouptut : Confirmation message for the user.

-> Errors: return errors/abort transaction if:
- any of the api parameters is absent,
- user donot have enough cash balance,
- resturnat id is not present,
- dish id for that particular resturant is not present