import axios from 'axios';
import { key, proxy} from '../config';

export default class Recipe {
    constructor (id){
        this.id = id;
    }

    async getRecipe ()  {

        try {
            const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            //console.log(res);
            this.title = res.data.recipe.title;
            this.publisher = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }
        catch(error){
            alert('Something went wrong :(');
        }
    }

    calcTime () {

        /// assuming that we need 15 mins for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }
    calcServings () {
        this.servings = 4;
    }

    parseIngredient(){

        const unitsLong = ['tablespoons', 'tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
        const units = [...unitsShort, 'kg', 'g'];
        const newIngredients = this.ingredients.map(el => {
            // Uniform Unit
            let ingredients = el.toLowerCase();
            unitsLong.forEach((unit, i)=> {
                ingredients = ingredients.replace(unit, unitsShort[i]);
            });
            // remove ()
            ingredients = ingredients.replace(/ *\([^)]*\) */g, ' ');
            
            ///finally count unit and ing
            const arrIng = ingredients.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
            //console.log (arrIng);
            let objIng;
            if (unitIndex > -1) {
                //There is a Unit
                //Ex.. 4 1/2cups, arrCount is [4, 1/2]
                // if 4 cups arrrcount is [4]
                const arrCount = arrIng.slice(0, unitIndex); 
                let count; 

                if (arrCount.length == 1){
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+')); // 4+1/2 => eval = 4.5
                    count = Math.round(count * 100) / 100;
                }

                objIng = {
                    count,
                    unit : arrIng[unitIndex],
                    ingredients: arrIng.slice(unitIndex + 1).join(' ')
                }
            } else if (unitIndex === -1 ){
                // There is no Unit
                objIng = {
                    count: 1,
                    unit:'',
                    ingredients
                }

            } else if (parseInt(arrIng[0],10)){
                //There is no unit but first element is number
                objIng = {
                    count: parseInt(arrIng[0],10),
                    unit: '',
                    ingredients: arrIng.slice(1).join(' ')
                }
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    };

    updateServings (type)  {
        // Seervings 
        const newServings = type === 'dec' ? this.servings - 1: this.servings + 1;
        this.ingredients.forEach(ing =>{
            ing.count *= (newServings / this.servings);

        })

        // ingredients 
        this.servings = newServings;




    }
}
























