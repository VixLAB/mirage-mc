import React, {useCallback, useEffect, useMemo, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    setFilter,
    selectFiltersList,
    selectHasEmpty
} from "../../reducer/streamfilters";
import { ActionCreators } from "redux-undo";
import {Button, createFilterOptions, Stack, TextField} from "@mui/material";
import {filterSearch} from "../EventTable/fields";
import {useDatabase} from "../../Providers/Database";
import {useLog} from "../../Providers/Firebase";
import SelectionWithOption from "./SelectionWithOption";

const OPTIONS_LIMIT = 50;
const defaultFilterOptions = createFilterOptions();

const filterOptionsFunc = (options, state) => {
    return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);
};


export default function FilterPanel() {
    const [filterOptions,setFilterOptions] = useState({});
    const {isLoading,searchByStream,getList} = useDatabase();
    const [categoryOption,setCategoryOption] = useState({});
    const categoryOptionList = useSelector(selectFiltersList);
    const hasEmpty = useSelector(selectHasEmpty);
    const dispatch = useDispatch();

    const {logEvents} = useLog();
    useEffect(()=>{
        const obj = {};
        categoryOptionList.forEach(element => {
            obj[element] = true;
        });
        setCategoryOption(obj);
    },[categoryOptionList])
    // useEffect(()=>{
    //     if (!Object.keys(filters).length) {
    //         // const newfilters = {};
    //         // filterSearch.forEach(f=>{
    //         //     newfilters[f.accessorKey] = null;
    //         // })
    //         // dispatch(setFilters({value: newfilters}));
    //         ActionCreators.clearHistory();
    //     }
    // },[]);
    const fields = getList('fields');

    useEffect(()=>{
        setFilterOptions({...fields});
    },[fields])
    return <Stack spacing={2} padding={2}>
        {categoryOptionList.map((d,i)=><SelectionWithOption 
            key={i}
            order={i}
            cat={d}
            options={filterSearch} 
            enabled={categoryOption}
            getList={getList}
            filterOptionsFunc={filterOptionsFunc}
            filterOptions={filterOptions}
            isLoading={isLoading}
            logEvents={logEvents}
            searchByStream={searchByStream}
        />)}
        {(categoryOptionList.length<filterSearch.length)&&<Button 
            variant="contained"
            disabled={hasEmpty}
            onClick={()=>{
                debugger
                dispatch(setFilter({key:''}));
            }}
        >
            Add filter
        </Button>}
        {/* {filterSearch.map(f=><CusAutocomplete
            key={f.accessorKey}
            multiple
            size="small"
            limitTags={2}
            filterOptions={filterOptionsFunc}
            ListboxComponent={ListboxComponent}
            freeSolo
            options={(f.dynamic?getList(`search-${f.accessorKey}`):filterOptions[f.accessorKey])??[]}
            loading={f.dynamic?isLoading(`search-${f.accessorKey}`):false}
            getOptionLabel={(d) => d}
            value={filters[f.accessorKey]??[]}
            onChange={(event, value) => {
                if (value!=='' && value && value.length)
                    logEvents('search',{'search_term':value,key:f.accessorKey,})
                dispatch(setFilter({key:f.accessorKey,value}));
            }}
            onInputChange={f.dynamic?((event, newInputValue) => {
                if (newInputValue&&newInputValue!=='')
                    searchByStream(f.accessorKey,newInputValue);
            }):undefined}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={f.header}
                />
            )}
        />)} */}
        {/*<TimeRangePicker*/}
        {/*    fromVal={(filters["time_station"]?.from)??null}*/}
        {/*    toVal={(filters["time_station"]?.to)??null}*/}
        {/*    onChange={(key,value) => {*/}
        {/*        const val = {...(filters["time_station"] ?? {})};*/}
        {/*        if (value)*/}
        {/*            val[key] = value;*/}
        {/*        else*/}
        {/*            delete val[key];*/}
        {/*        dispatch(setFilter({key:"time_station",value:val}));*/}
        {/*    }}*/}
        {/*/>*/}
    </Stack>
}