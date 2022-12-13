<template>
  <div v-if="dataLoaded">
    <div class="row" style="min-height: 100%">
      <!-- Filter menu-->
      <div class="col-3 border-end border-dark">
        <!-- Rate -->
        <div class="mb-4">
          <div class="asp-title" role="button" @click="setArrowDirectionClass('rate')">
            {{ $t('display_text.rate.rate') }}
            <i :class="`bi bi-arrow-${arrowDirectionClass.rate}-short pe-1`"></i>
          </div>
          <div :class="{'collapse': arrowDirectionClass.rate === 'up'}" class="mt-3">
            <div class="mb-2">
              <div class="d-flex align-items-baseline">
                <label class="form-label mb-0 me-2">{{ $t('display_text.min') }} :</label>
                <asp-rate-form :selected-star="minRate" stars-size="fs-4"
                               @[rateSelectedEvent]="validateMinRateField"></asp-rate-form>
              </div>
              <invalid-feedback :error="errors.minRate" />
            </div>
            <div>
              <div class="d-flex align-items-baseline">
                <label class="form-label mb-0 me-2">{{ $t('display_text.max') }} :</label>
                <asp-rate-form :selected-star="maxRate" stars-size="fs-4"
                               @[rateSelectedEvent]="validateMaxRateField"></asp-rate-form>
              </div>
              <invalid-feedback :error="errors.maxRate" />
            </div>
          </div>
        </div>
        <!-- Place -->
        <div class="mb-4">
          <div class="asp-title" role="button" @click="setArrowDirectionClass('placeTitle')">
            {{ $t('display_text.place_title') }}
            <i :class="`bi bi-arrow-${arrowDirectionClass.placeTitle}-short pe-1`"></i>
          </div>
          <div :class="{'collapse': arrowDirectionClass.placeTitle === 'up'}" class="mt-3">
            <label class="form-label input-required-lbl" for="placeTitle">{{ $t('fields.place_title') }}</label>
            <select v-model="placeTitle" :class="hiddenClass.placeTitle" class="form-select" required="required"
                    @focusin="resetValidationOnField('placeTitle')" @focusout="validatePlaceTitleField">
              <option :selected="placeTitle.length > 0" value="">{{ $t('fields.place_title') }}</option>
              <option v-for="onePlaceTitle in placeTitles" :key="onePlaceTitle.title"
                      :selected="placeTitle === onePlaceTitle.title" :value="onePlaceTitle.title">
                {{ onePlaceTitle.title }}
              </option>
            </select>
            <invalid-feedback :error="errors.placeTitle" />
          </div>
        </div>
        <!-- Style -->
        <div class="mb-4">
          <div class="asp-title" role="button" @click="setArrowDirectionClass('style')">
            {{ $t('display_text.style') }}
            <i :class="`bi bi-arrow-${arrowDirectionClass.style}-short pe-1`"></i>
          </div>
          <div :class="{'collapse': arrowDirectionClass.style === 'up'}" class="mt-3">
            <div v-for="style in styles" :key="style" class="form-check">
              <input :id="style" v-model="ckbStyles" :value="style" class="form-check-input" type="checkbox" />
              <label :for="style" class="form-check-label">
                {{ $t(`climb_style.${ style }`) }}
              </label>
            </div>
          </div>
        </div>
        <!-- Difficulty level -->
        <div class="mb-4">
          <div class="asp-title" role="button" @click="setArrowDirectionClass('difficultyLevel')">
            {{ $t('display_text.difficulty_level') }}
            <i :class="`bi bi-arrow-${arrowDirectionClass.difficultyLevel}-short pe-1`"></i>
          </div>
          <div :class="{'collapse': arrowDirectionClass.difficultyLevel === 'up'}" class="mt-3">
            <div class="d-flex justify-content-between mb-3">
              <div>
                <label class="form-label input-required-lbl" for="difficultyLevelMin">
                  {{ $t('display_text.min') }}
                </label>
                <input v-model="difficultyLevelMin" :class="hiddenClass.difficultyLevelMin" class="form-control"
                       required="required" type="text" @focusin="resetValidationOnField('difficultyLevelMin')"
                       @focusout="validateDifficultyLevelMinField" />
                <invalid-feedback :error="errors.difficultyLevelMin" />
              </div>
              <div class="ms-1 me-1"></div>
              <div>
                <label class="form-label input-required-lbl" for="difficultyLevelMax">
                  {{ $t('display_text.max') }}
                </label>
                <input v-model="difficultyLevelMax" :class="hiddenClass.difficultyLevelMax" class="form-control"
                       required="required" type="text" @focusin="resetValidationOnField('difficultyLevelMax')"
                       @focusout="validateDifficultyLevelMaxField" />
                <invalid-feedback :error="errors.difficultyLevelMax" />
              </div>
            </div>
            <div class="d-flex justify-content-end">
              <button class="btn btn-lg fs-6 btn-submit" type="submit" @click.prevent.stop="getSearch(false)">
                {{ $t('buttons.filter') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Climb results -->
      <div class="col-9">
        <asp-search-climbs v-if="searchLoaded" :can-delete-climb="isAdmin" :col-class="'col col-lg-6 col-xl-4 p-1'"
                           :items="items" @[climbToDeleteSelected]="setClimbTitle" />
        <div v-if="hasMoreResult" class="d-flex justify-content-center mt-3">
          <button class="btn btn-lg fs-6 btn-submit" type="submit" @click.prevent.stop="getSearch(true)">
            {{ $t('buttons.load_more') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AspRateForm from '@/components/Rate/RateForm.vue';
import AspRate from '@/components/Rate/Display/Rate.vue';
import ClimbCard from '@/components/Climb/Card.vue';
import AspSearchClimbs from '@/components/Climb/Search.vue';
import errors from '@/includes/errors.json';
import { status, validationHiddenClass } from '@/includes/enums';
import InvalidFeedback from '@/components/InvalidFeedback.vue';
import {
  getFormData,
  getHeaderAuthorization,
  validateEmptyOrWhiteSpace,
  validateForm,
  validateRange
} from '@/includes/validation';
import { CLIMB_TO_DELETE_SELECTED, RATE_SELECTED } from '@/includes/events';

const limit = 9;
export default {
  name: 'Asp-Climbs-View',
  props: ['isAdmin'],
  emits: [CLIMB_TO_DELETE_SELECTED],
  components: {
    AspRateForm,
    AspRate,
    ClimbCard,
    InvalidFeedback,
    AspSearchClimbs
  },
  data() {
    let data = getFormData(['minRate', 'maxRate', 'placeTitle', 'difficultyLevelMin', 'difficultyLevelMax']);
    data.difficultyLevelsArray = ['5.6', '5.7', '5.8', '5.9', '5.10', '5.11', '5.12', '5.13', '5.14', '5.15'];
    data.minRate = 0;
    data.maxRate = 0;
    data.placeTitles = [];
    data.ckbStyles = [];
    data.styles = [];
    data.items = [];
    data.dataLoaded = false;
    data.searchLoaded = false;
    data.offset = 0;
    data.searchParams = [];
    data.arrowDirectionClass = {
      rate: 'down',
      placeTitle: 'down',
      style: 'down',
      difficultyLevel: 'down'
    };
    data.rateSelectedEvent = RATE_SELECTED;
    data.climbToDeleteSelected = CLIMB_TO_DELETE_SELECTED;
    data.hasMoreResult = true;
    return data;
  },
  methods: {
    setClimbTitle(value) {
      this.$emit(CLIMB_TO_DELETE_SELECTED, value);
    },
    setArrowDirectionClass(key) {
      this.arrowDirectionClass[key] = this.arrowDirectionClass[key] === 'down' ? 'up' : 'down';
    },
    resetValidationOnField(field) {
      if (this.hiddenClass[field].length > 0)
        this.errors[field] = { wasValidated: '' };
      this.hiddenClass[field] = '';
    },
    setValidationOnField(field, indicateIsValid, trim = true) {
      if (this.errors[field].length > 0) {
        this.hiddenClass[field] = validationHiddenClass.isInvalid;
      } else if (indicateIsValid) {
        this.hiddenClass[field] = validationHiddenClass.isValid;

        if (trim) {
          this[field].trim();
        }
      }
    },
    validateMinRateField(value) {
      let indicateIsValid = typeof this.errors.minRate !== 'string';
      this.errors.minRate = '';

      if (typeof value !== 'number') {
        this.errors.minRate = errors.climb.rate.not_integer;
      } else if (value > 0) {
        if (!validateRange(value, 0, this.maxRate, false)) {
          this.errors.minRate = errors.climb.rate.range.min;
        }
      }

      this.minRate = value;
      this.setValidationOnField('minRate', indicateIsValid);
    },
    validateMaxRateField(value) {
      let indicateIsValid = typeof this.errors.maxRate !== 'string';
      this.errors.maxRate = '';

      if (typeof value !== 'number') {
        this.errors.maxRate = errors.climb.rate.not_integer;
      } else if (value > 0) {
        if (!validateRange(value, this.minRate, 5, false)) {
          this.errors.maxRate = errors.climb.rate.range.max;
        }
      }

      this.maxRate = value;
      this.setValidationOnField('maxRate', indicateIsValid);
    },
    validatePlaceTitleField() {
      let indicateIsValid = typeof this.errors.placeTitle !== 'string';
      this.errors.placeTitle = '';
      let value = `${ this.placeTitle }`;

      if (!validateEmptyOrWhiteSpace(value)) {
        this.errors.placeTitle = errors.climb.place_title.empty_or_white_spaces;
      } else if (!validateRange(value, 3, 50)) {
        this.errors.placeTitle = errors.climb.place_title.length;
      }

      this.setValidationOnField('placeTitle', indicateIsValid, false);
    },
    validateDifficultyLevel(value) {
      return this.difficultyLevelsArray.find(d => d === String(value)) !== undefined;
    },
    validateDifficultyLevelMinField() {
      let indicateIsValid = typeof this.errors.difficultyLevelMin !== 'string';
      this.errors.difficultyLevelMin = '';
      let value = this.difficultyLevelMin;
      value.trim();

      if (value !== '' && !this.validateDifficultyLevel(value)) {
        this.errors.difficultyLevelMin = errors.climb.difficulty_level.range;
      } else if (this.difficultyLevelMax !== '') {
        let difficultyLevelMaxIndex = this.difficultyLevelsArray.indexOf(this.difficultyLevelMax);
        if (difficultyLevelMaxIndex > -1 && this.difficultyLevelsArray.indexOf(value) > difficultyLevelMaxIndex) {
          this.errors.difficultyLevelMin = errors.climb.difficulty_level.min;
        }
      }

      this.setValidationOnField('difficultyLevelMin', indicateIsValid, false);
    },
    validateDifficultyLevelMaxField() {
      let indicateIsValid = typeof this.errors.difficultyLevelMax !== 'string';
      this.errors.difficultyLevelMax = '';
      let value = this.difficultyLevelMax;
      value.trim();

      if (value !== '' && !this.validateDifficultyLevel(value)) {
        this.errors.difficultyLevelMin = errors.climb.difficulty_level.range;
      } else if (this.difficultyLevelMax !== '') {
        let difficultyLevelMinIndex = this.difficultyLevelsArray.indexOf(this.difficultyLevelMin);
        if (difficultyLevelMinIndex > -1 && this.difficultyLevelsArray.indexOf(value) < difficultyLevelMinIndex) {
          this.errors.difficultyLevelMax = errors.climb.difficulty_level.max;
        }
      }
      this.setValidationOnField('difficultyLevelMax', indicateIsValid, false);
    },
    getURLSearchParams(loadMore) {
      let params = [];
      if (loadMore) {
        if (this.searchParams.length > 0) {
          params.push(...this.searchParams);
        }
        params.push(['offset', this.offset]);
      } else {
        if (this.maxRate > 0) {
          params.push(['rate', this.minRate], ['rate', this.maxRate]);
        }
        if (this.placeTitle.length > 0) {
          params.push(['place', this.placeTitle]);
        }
        if (this.ckbStyles.length > 0) {
          this.ckbStyles.forEach((s, i) => params.push(['style', s]));
        }
        if (this.difficultyLevelMin !== '' && this.difficultyLevelMax !== '') {
          params.push(['difficultyLevel', this.difficultyLevelMin],
              ['difficultyLevel', this.difficultyLevelMax]);
        }
        this.searchParams = [...params];
        params.push(['offset', 0]);
      }

      params.push(['limit', limit]);
      return new URLSearchParams(params);
    },
    async getData(loadMore = false) {
      let response;
      try {
        response = await fetch(`/api/climb/all/?${ this.getURLSearchParams(loadMore) }`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getHeaderAuthorization()
          }
        });
      } catch {
        return {
          codes: { 'search': errors.routes.home },
          status: status.error
        };
      }

      if (response.status === 500) {
        return {
          codes: { 'search': errors.routes.home },
          status: status.error
        };
      }

      return await response.json();
    },
    async getSearch(loadMore) {
      if (loadMore
          || this.minRate > 0
          || this.maxRate > 0
          || this.placeTitle.length > 0
          || this.ckbStyles.length > 0
          || this.difficultyLevelMin !== ''
          && this.difficultyLevelMax !== '') {
        this.validateMinRateField(this.minRate);
        this.validateMaxRateField(this.maxRate);
        if (this.placeTitle.length > 0) {
          this.validatePlaceTitleField();
        }
        this.validateDifficultyLevelMinField();
        this.validateDifficultyLevelMaxField();

        if (validateForm(this.errors)) {
          let data = await this.getData(loadMore);
          if (loadMore) {
            data.result.items.forEach(item => {
              if (this.items.find(i => i.title === item.title) === undefined) {
                this.items.push(item);
              }
            });
          } else {
            this.items = data.result.items;
          }
          this.offset = data.result.offset;
          this.hasMoreResult = data.result.hasMoreResult;
        }
      }
    }
  },
  async mounted() {
    let data = await this.getData();

    for (const [key, value] of Object.entries(data.result)) {
      this[key] = value;
    }

    this.dataLoaded = true;
    this.searchLoaded = true;
  }
};
</script>

<style scoped>

</style>