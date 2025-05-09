(function(){"use strict";class m{static ToInt32Array(t){const e=new Int32Array(t.length);for(let r=0,s=t.length;r<s;r++)e[r]=t[r];return e}}class S{static getHashCode(t){let e=5381,r=e;for(let s=0,i=t.length;s<i&&t[s]!="\0"&&(e=(e<<5)+e^t.charCodeAt(s),s!==i-1&&t[s+1]!=="\0");s+=2)r=(r<<5)+r^t.charCodeAt(s+1);return e+1566083941*r|0}}class I{static isSurrogate(t){const e=t.charCodeAt(0);return e>=55296&&e<=57343}static isAlphanumeric(t){const e=t.charCodeAt(0);return e>=48&&e<=57||e>=65&&e<=90||e>=97&&e<=122}static isLowerAlpha(t){const e=t.charCodeAt(0);return e>=97&&e<=122}}class p{constructor(t,e,r){this.matches=void 0,this.query=void 0,this.meta=void 0,this.matches=t,this.query=e,this.meta=r}}class d{constructor(t){this.entries=void 0,this.entries=t!==void 0?t:new Map}add(t,e){if(this.entries.has(t))throw new Error(`A meta entry with key ${t} is already present.`);this.entries.set(t,e)}get(t){return this.entries.get(t)}get allEntries(){return this.entries}}class y{constructor(t,e=10,r=.3){this.string=void 0,this.topN=void 0,this.minQuality=void 0,this.string=t,this.topN=Math.max(0,e),this.minQuality=Math.max(0,Math.min(1,r))}}class E{constructor(t,e){this.removedEntities=void 0,this.meta=void 0,this.removedEntities=t,this.meta=e}}class z{static mergeResults(t,e){const r=t.query,s=this.mergeMatches(t.matches,e.matches,r.topN),i=this.mergeMeta(t.meta,e.meta);return new p(s,r,i)}static mergeMatches(t,e,r){if(e.length===0)return t;if(t.length===0)return e;const s=[...t,...e];return s.sort((i,n)=>i.quality>n.quality?-1:i.quality<n.quality?1:0),s.length<=r?s:s.slice(0,r)}static mergeMeta(t,e){const r=new Map;for(const[s,i]of t.allEntries)r.set(s,i);for(const[s,i]of e.allEntries){const n=r.get(s);n!==void 0?typeof n!="number"||typeof i!="number"?(r.delete(s),r.set(`${s}_0`,n),r.set(`${s}_1`,i)):r.set(s,n+i):r.set(s,i)}return new d(r)}}class A{constructor(t,e,r){this.maxQueryLength=void 0,this.mainSearcher=void 0,this.secondarySearcher=void 0,this.maxQueryLength=t,this.mainSearcher=e,this.secondarySearcher=r}indexEntities(t,e,r){return this.secondarySearcher.indexEntities([],e,r),this.mainSearcher.indexEntities(t,e,r)}getMatches(t){return t.string?(t.string.length>this.maxQueryLength&&(t=new y(t.string.substring(0,this.maxQueryLength),t.topN,t.minQuality)),z.mergeResults(this.mainSearcher.getMatches(t),this.secondarySearcher.getMatches(t))):new p([],t,new d)}tryGetTerms(t){const e=this.mainSearcher.tryGetTerms(t);return e!==null?e:this.secondarySearcher.tryGetTerms(t)}getTerms(){return this.mainSearcher.getTerms().concat(this.secondarySearcher.getTerms())}tryGetEntity(t){var e,r;return(e=(r=this.mainSearcher.tryGetEntity(t))!=null?r:this.secondarySearcher.tryGetEntity(t))!=null?e:null}getEntities(){return this.mainSearcher.getEntities().concat(this.secondarySearcher.getEntities())}removeEntities(t){const e=[];for(let s=0,i=t.length;s<i;s++)(this.mainSearcher.removeEntity(t[s])||this.secondarySearcher.removeEntity(t[s]))&&e.push(t[s]);const r=new d;return new E(e,r)}upsertEntities(t,e,r){const s=[],i=[];for(let n=0,h=t.length;n<h;n++){const o=t[n],c=e(o);this.tryUpdate(o,c,r)||(s.push(c),i.push(o))}return this.removeEntities(s),t.length>0?this.reindexSecondarySearcher(i,e,r):new d}reindexSecondarySearcher(t,e,r){const s=this.secondarySearcher.getEntities().concat(t);return this.secondarySearcher.indexEntities(s,e,r)}tryUpdate(t,e,r){return this.tryUpdateSearcher(t,e,r,this.mainSearcher)||this.tryUpdateSearcher(t,e,r,this.secondarySearcher)}tryUpdateSearcher(t,e,r,s){const i=s.tryGetTerms(e);if(i===null)return!1;if(this.termsAreEqual(i,r(t))){if(!s.replaceEntity(e,t,e))throw new Error(`Entity with id ${e} was not present.`);return!0}return!1}termsAreEqual(t,e){return t===e||t!=null&&e!=null&&t.length===e.length&&t.every((r,s)=>r===e[s])}save(t){this.mainSearcher.save(t),this.secondarySearcher.save(t)}load(t){this.mainSearcher.load(t),this.secondarySearcher.load(t)}}class q{constructor(t){this.dynamicSearcher=void 0,this.dynamicSearcher=t}removeEntities(t){const e=performance.now(),r=this.dynamicSearcher.removeEntities(t),s=Math.round(performance.now()-e);return r.meta.add("removalDuration",s),r}upsertEntities(t,e,r){const s=performance.now(),i=this.dynamicSearcher.upsertEntities(t,e,r),n=Math.round(performance.now()-s);return i.add("upsertDuration",n),i}indexEntities(t,e,r){const s=performance.now(),i=this.dynamicSearcher.indexEntities(t,e,r),n=Math.round(performance.now()-s);return i.add("indexingDuration",n),i}getMatches(t){const e=performance.now(),r=this.dynamicSearcher.getMatches(t),s=Math.round(performance.now()-e);return r.meta.add("queryDuration",s),r}tryGetEntity(t){return this.dynamicSearcher.tryGetEntity(t)}getEntities(){return this.dynamicSearcher.getEntities()}tryGetTerms(t){return this.dynamicSearcher.tryGetTerms(t)}getTerms(){return this.dynamicSearcher.getTerms()}save(t){this.dynamicSearcher.save(t)}load(t){this.dynamicSearcher.load(t)}}class b{constructor(t,e,r){this.entity=void 0,this.quality=void 0,this.matchedString=void 0,this.entity=t,this.quality=e,this.matchedString=r}}class O{constructor(t){this.stringSearcher=void 0,this.entities=void 0,this.idToIndex=void 0,this.terms=void 0,this.termIndexToEntityIndex=void 0,this.entityIndexToFirstTermIndex=void 0,this.stringSearcher=t,this.entities=[],this.idToIndex=new Map,this.terms=[],this.termIndexToEntityIndex=new Int32Array(0),this.entityIndexToFirstTermIndex=new Int32Array(0)}indexEntities(t,e,r){this.entities=[...t],this.idToIndex=new Map,this.terms=[];const s=[],i=[];for(let h=0,o=t.length;h<o;h++){this.idToIndex.set(e(t[h]),h);const c=r(t[h]);i.push(this.terms.length),this.terms.push(...c),s.push(...c.map(()=>h))}this.termIndexToEntityIndex=m.ToInt32Array(s),this.entityIndexToFirstTermIndex=m.ToInt32Array(i);const n=this.stringSearcher.index(this.terms);return n.add("numberOfEntities",this.entities.length),n.add("numberOfTerms",this.terms.length),n}getMatches(t){const e=new y(t.string,1/0,t.minQuality),r=this.stringSearcher.getMatches(e),s=this.getMatchesFromResult(r,t.topN);return new p(s,t,r.meta)}getMatchesFromResult(t,e){if(e===0)return[];const r=new Set,s=[];for(let i=0,n=t.matches.length;i<n;i++){const h=t.matches[i],o=this.termIndexToEntityIndex[h.index];if(!r.has(o)&&this.entities[o]!==null&&(r.add(o),s.push(new b(this.entities[o],h.quality,this.terms[h.index])),s.length===e))break}return s}tryGetEntity(t){const e=this.idToIndex.get(t);return e===void 0?null:this.entities[e]}getEntities(){return this.entities.filter(t=>t!==null)}tryGetTerms(t){const e=this.idToIndex.get(t);return e===void 0?null:this.terms.slice(this.entityIndexToFirstTermIndex[e],e===this.entities.length-1?this.terms.length:this.entityIndexToFirstTermIndex[e+1])}getTerms(){const t=[];for(let e=0,r=this.termIndexToEntityIndex.length;e<r;e++)this.entities[this.termIndexToEntityIndex[e]]!==null&&t.push(this.terms[e]);return t}removeEntity(t){const e=this.idToIndex.get(t);return e!==void 0&&(this.entities[e]=null,this.idToIndex.delete(t),!0)}replaceEntity(t,e,r){const s=this.idToIndex.get(t);return s!==void 0&&(this.entities[s]=e,this.idToIndex.delete(t),this.idToIndex.set(r,s),!0)}save(t){t.add(this.entities),t.add(this.idToIndex),t.add(this.terms),t.add(this.termIndexToEntityIndex),t.add(this.entityIndexToFirstTermIndex),this.stringSearcher.save(t)}load(t){this.entities=t.get(),this.idToIndex=t.get(),this.terms=t.get(),this.termIndexToEntityIndex=t.get(),this.entityIndexToFirstTermIndex=t.get(),this.stringSearcher.load(t)}}class l{constructor(t,e){this.strings=void 0,this.meta=void 0,this.strings=t,this.meta=e}}class F{constructor(t){this.normalizationFunction=void 0,this.normalizationFunction=t}normalize(t){return this.normalizationFunction(t)}normalizeBulk(t){const e=t.map(r=>this.normalize(r));return new l(e,new d)}}class L{constructor(t){this.normalizers=void 0,this.normalizers=t}normalize(t){for(let e=0,r=this.normalizers.length;e<r;e++)t=this.normalizers[e].normalize(t);return t}normalizeBulk(t){const e=new d;for(let r=0,s=this.normalizers.length;r<s;r++){const i=this.normalizers[r].normalizeBulk(t);t=i.strings;for(const n of i.meta.allEntries)e.add(n[0],n[1])}return new l(t,e)}}class Q{constructor(t){this.paddingLeft=void 0,this.paddingRight=void 0,this.paddingMiddle=void 0,this.paddingCharacters=void 0,this.treatCharacterAsSpace=void 0,this.allowCharacter=void 0,this.numberOfSurrogateCharacters=0,this.paddingLeft=t.paddingLeft,this.paddingRight=t.paddingRight,this.paddingMiddle=t.paddingMiddle,this.paddingCharacters=new Set([t.paddingLeft.split(""),t.paddingRight.split(""),t.paddingMiddle.split("")].flat()),this.treatCharacterAsSpace=t.treatCharacterAsSpace,this.allowCharacter=t.allowCharacter}normalize(t){const e=new Array(t.length+2);let r=0;e[r++]=this.paddingLeft;let s=!0,i=!1,n=!1;for(let h=0,o=t.length;h<o;h++){const c=this.getNormalizedCharacter(t[h]);c!==""&&(c===" "?i=!0:(i&&!s&&(e[r++]=this.paddingMiddle),e[r++]=c,n=!0,s=!1,i=!1))}return e[r++]=this.paddingRight,n?e.join(""):""}getNormalizedCharacter(t){return t===" "||this.treatCharacterAsSpace(t)?" ":this.isSurrogate(t)||this.paddingCharacters.has(t)||!this.allowCharacter(t)?"":t.toLowerCase()}isSurrogate(t){return!!I.isSurrogate(t)&&(this.numberOfSurrogateCharacters++,!0)}normalizeBulk(t){this.numberOfSurrogateCharacters=0;const e=t.map(s=>this.normalize(s)),r=new d;return r.add("numberOfSurrogateCharacters",this.numberOfSurrogateCharacters),new l(e,r)}}class D{normalize(t){return t||""}normalizeBulk(t){const e=t.map(r=>this.normalize(r));return new l(e,new d)}}class G{constructor(t,e){this.normalizeVariationsAndInput=void 0,this.replacements=void 0,this.normalizeVariationsAndInput=e,this.replacements=[];for(const r of t){const s=new Map;for(const[i,n]of r)for(const h of n){const o=e(h);s.set(o,i)}this.replacements.push(s)}}normalize(t){t=this.normalizeVariationsAndInput(t);const e=new Array(t.length);let r=0;for(let s=0,i=t.length;s<i;s++)for(const n of this.replacements){const h=n.get(t[s]);if(h!==void 0){e[r++]=h;break}e[r++]=t[s]}return e.join("")}normalizeBulk(t){const e=t.map(r=>this.normalize(r));return new l(e,new d)}}class k{static create(t){const e=new D,r=new G(t.replacements,n=>n.toLowerCase().normalize("NFKC")),s=new F(n=>n.normalize("NFKD")),i=new Q(t);return new L([e,r,s,i])}}class T{constructor(t,e){this.index=void 0,this.quality=void 0,this.index=t,this.quality=e,this.index=t,this.quality=e}}class u{constructor(t,e,r){this.matches=void 0,this.query=void 0,this.meta=void 0,this.matches=t,this.query=e,this.meta=r}}class R{constructor(t){this.stringSearcher=void 0,this.distinctMapping=void 0,this.sortMapping=void 0,this.stringSearcher=t,this.distinctMapping=new Int32Array(0),this.sortMapping=new Int32Array(0)}index(t){const e=t.map((o,c)=>({term:o,index:c}));e.sort((o,c)=>o.term<c.term?-1:o.term>c.term?1:0),this.sortMapping=new Int32Array(e.length);for(let o=0,c=e.length;o<c;o++)this.sortMapping[o]=e[o].index;const r=[],s=[];let i=0,n=null;for(let o=0,c=e.length;o<c;o++){const g=e[o].term;g!=n&&(r[i]=g,s[i]=o,i++),n=g}s[i++]=e.length,this.distinctMapping=m.ToInt32Array(s);const h=this.stringSearcher.index(r);return h.add("numberOfDistinctTerms",r.length),h}getMatches(t){const e=this.stringSearcher.getMatches(t),r=new Array(e.matches.length);let s=0;return e.matches.forEach(i=>{const n=this.distinctMapping[i.index+1];for(let h=this.distinctMapping[i.index];h<n;h++)r[s++]=new T(this.sortMapping[h],i.quality)}),new u(r,t,e.meta)}save(t){t.add(this.distinctMapping),t.add(this.sortMapping),this.stringSearcher.save(t)}load(t){this.distinctMapping=t.get(),this.sortMapping=t.get(),this.stringSearcher.load(t)}}class C{constructor(){this.ids=void 0,this.frequencies=void 0,this.ids=[],this.frequencies=[]}addId(t,e){this.ids.push(t),this.frequencies.push(e)}seal(){this.ids=m.ToInt32Array(this.ids),this.frequencies=m.ToInt32Array(this.frequencies)}get length(){return this.ids.length}save(t){t.add(this.ids),t.add(this.frequencies)}load(t){this.ids=t.get(),this.frequencies=t.get()}}class f{constructor(){this.ngramToTermIds=void 0,this.ngramToTermIds=new Map}add(t,e,r){let s=this.ngramToTermIds.get(t);s||(s=new C,this.ngramToTermIds.set(t,s)),s.addId(e,r)}seal(){for(const t of this.ngramToTermIds.values())t.seal()}getIds(t){return this.ngramToTermIds.get(t)}get size(){return this.ngramToTermIds.size}save(t){t.add(this.ngramToTermIds.size);for(const[e,r]of this.ngramToTermIds)t.add(e),r.save(t)}load(t){const e=t.get();for(let r=0;r<e;r++){const s=t.get(),i=new C;i.load(t),this.ngramToTermIds.set(s,i)}}}class B{static ComputeJaccardCoefficient(t,e,r){return r/(t+e-r)}static ComputeOverlapMaxCoefficient(t,e,r){return r/Math.max(t,e)}}class ${constructor(t){this.ngramComputer=void 0,this.invertedIndex=void 0,this.numberOfNgrams=void 0,this.commonNgramCounts=void 0,this.ngramComputer=t,this.invertedIndex=new f,this.numberOfNgrams=new Int32Array(0),this.commonNgramCounts=new Int32Array(0)}index(t){this.invertedIndex=new f,this.commonNgramCounts=new Int32Array(t.length),this.numberOfNgrams=new Int32Array(t.length);const e=new d;let r=0;for(let s=0,i=t.length;s<i;s++){const n=t[s];if(!this.isValidTerm(n)){this.numberOfNgrams[s]=0,r++;continue}const h=this.ngramComputer.computeNgrams(n);this.numberOfNgrams[s]=h.length;const o=this.getNgramsToFrequency(h);for(const[c,g]of o)this.invertedIndex.add(c,s,g)}return this.invertedIndex.seal(),e.add("numberOfInvalidTerms",r),e}isValidTerm(t){return t!=null&&t.trim()!==""}getMatches(t){if(this.invertedIndex.size===0)return new u([],t,new d);const e=this.ngramComputer.computeNgrams(t.string),r=this.getNgramsToFrequency(e),s=e.length;this.computeCommonNgramCounts(r);const i=this.getMatchesFromCommonNgrams(s,t.minQuality);return new u(i,t,new d)}computeCommonNgramCounts(t){this.commonNgramCounts.fill(0);for(const[e,r]of t){const s=this.invertedIndex.getIds(e);if(s!=null)for(let i=0,n=s.length;i<n;i++)this.commonNgramCounts[s.ids[i]]+=Math.min(r,s.frequencies[i])}}getNgramsToFrequency(t){const e=new Map;for(let r=0,s=t.length;r<s;r++){const i=t[r],n=e.get(i);e.set(i,n!==void 0?n+1:1)}return e}getMatchesFromCommonNgrams(t,e){const r=[];for(let s=0,i=this.numberOfNgrams.length;s<i;s++){const n=B.ComputeOverlapMaxCoefficient(t,this.numberOfNgrams[s],this.commonNgramCounts[s]);n>e&&r.push(new T(s,n))}return r}save(t){this.invertedIndex.save(t),t.add(this.numberOfNgrams)}load(t){this.invertedIndex=new f,this.invertedIndex.load(t),this.numberOfNgrams=t.get(),this.commonNgramCounts=new Int32Array(this.numberOfNgrams.length)}}class j{constructor(t,e){this.stringSearcher=void 0,this.penaltyFactor=void 0,this.hashCodes=void 0,this.stringSearcher=t,this.penaltyFactor=1-e,this.hashCodes=new Int32Array(0)}index(t){this.hashCodes=new Int32Array(t.length);for(let e=0,r=t.length;e<r;e++)this.hashCodes[e]=S.getHashCode(t[e]);return this.stringSearcher.index(t)}getMatches(t){const e=S.getHashCode(t.string),r=this.stringSearcher.getMatches(t),s=r.matches.map(i=>this.penalizeMatch(i,e)).filter(i=>i.quality>=t.minQuality);return new u(s,r.query,r.meta)}penalizeMatch(t,e){return t.quality*=this.hashCodes[t.index]===e?1:this.penaltyFactor,t}save(t){t.add(this.hashCodes),this.stringSearcher.save(t)}load(t){this.hashCodes=t.get(),this.stringSearcher.load(t)}}class V{constructor(t){var e;this.ngramN=void 0,this.transformNgram=void 0,this.ngramN=t.ngramN,this.transformNgram=(e=t.transformNgram)!=null?e:r=>r}computeNgrams(t){if(t.length===0)return[];if(t.length<=this.ngramN){const r=this.transformNgram(t);return r?[r]:[]}const e=[];for(let r=0,s=this.maximumNumberOfNgrams(t);r<s;r++){const i=this.transformNgram(t.substring(r,r+this.ngramN));i&&e.push(i)}return e}maximumNumberOfNgrams(t){return Math.max(t.length-this.ngramN+1,t.length>0?1:0)}}class U{constructor(t,e){this.stringSearcher=void 0,this.normalizer=void 0,this.stringSearcher=t,this.normalizer=e}index(t){const e=performance.now(),r=this.normalizer.normalizeBulk(t),s=Math.round(performance.now()-e),i=this.stringSearcher.index(r.strings);i.add("normalizationDuration",s);for(const n of r.meta.allEntries)i.add(n[0],n[1]);return i}getMatches(t){const e=new y(this.normalizer.normalize(t.string),t.topN,t.minQuality),r=this.stringSearcher.getMatches(e);return new u(r.matches,t,r.meta)}save(t){this.stringSearcher.save(t)}load(t){this.stringSearcher.load(t)}}class H{constructor(t){this.stringSearcher=void 0,this.stringSearcher=t}index(t){return this.stringSearcher.index(t)}getMatches(t){const e=this.stringSearcher.getMatches(t);return e.matches.sort(this.compareMatchesByQualityAndIndex),e}compareMatchesByQualityAndIndex(t,e){return t.quality>e.quality?-1:t.quality<e.quality?1:t.index<e.index?-1:t.index>e.index?1:0}save(t){this.stringSearcher.save(t)}load(t){this.stringSearcher.load(t)}}class M{static createSearcher(t){const e=new V(t.ngramComputerConfig),r=k.create(t.normalizerConfig);let s=new $(e);return s=new j(s,t.inequalityPenalty),s=new R(s),s=new H(s),s=new U(s,r),new O(s)}}class v{constructor(t,e){this.ngramN=void 0,this.transformNgram=void 0,this.ngramN=t,this.transformNgram=e}static createDefaultConfig(){return new v(3,t=>t.endsWith("$")?null:t.indexOf("$")===-1?t.split("").sort().join(""):t)}}class P{constructor(t){this.objects=[],this.getIndex=0,t&&(this.objects=t)}add(t){this.objects.push(t)}get(){return this.objects[this.getIndex++]}}class N{}N.Value=new Map([["a",["ᶏ","ⱥ","ɑ","ᴀ","ɐ","ɒ"]],["aa",["å","ꜳ"]],["ae",["ä","æ","ᴁ","ᴭ","ᵆ","ǽ","ǣ","ᴂ"]],["ao",["ꜵ"]],["au",["ꜷ"]],["av",["ꜹ","ꜻ"]],["ay",["ꜽ"]],["b",["ƀ","ɓ","ƃ","ᵬ","ᶀ","ʙ"]],["c",["ȼ","ƈ","ɕ","ᴄ","ꜿ","ↄ"]],["d",["đ","ð","ɖ","ɗ","ƌ","ᵭ","ᶁ","ᶑ","ȡ","ᴅ","ꝺ"]],["db",["ȸ"]],["e",["ᶒ","ɇ","ⱸ","ᴇ","ə","ǝ","ɛ"]],["eo",["ᴔ"]],["f",["ƒ","ᵮ","ᶂ","ꜰ","ꝼ"]],["g",["ǥ","ɠ","ᶃ","ɢ","ȝ","ŋ","ꞡ","ᵹ","ꝿ"]],["h",["ħ","ⱨ","ɦ","ʜ","̃","ɧ","ⱶ","ɥ"]],["hv",["ƕ"]],["i",["ɨ","ᵻ","ᶖ","ı","ɪ","ɩ"]],["j",["ɉ","ȷ","ʝ","ɟ","ʄ","ᴊ"]],["k",["ƙ","ⱪ","ᶄ","ꝁ","ᴋ","ꝃ","ꝅ","ꞣ"]],["l",["ł","ƚ","ⱡ","ɫ","ɬ","ᶅ","ɭ","ȴ","ʟ","ꝉ","ꞁ","ꝇ"]],["m",["ᵯ","ᶆ","ɱ","ᴍ","ɯ"]],["n",["ɲ","ƞ","ᵰ","ᶇ","ɳ","ȵ","ɴ","ꞑ","ꞥ"]],["o",["ø","ǿ","ɵ","ɔ","ⱺ","ᴏ","ꝋ","ꝍ"]],["oe",["ö","œ"]],["oi",["ƣ"]],["oo",["ꝏ"]],["ou",["ȣ"]],["p",["ᵽ","ƥ","ᵱ","ᶈ","ᴘ","ƿ","ꝑ","ꝓ","ꝕ"]],["q",["ɋ","ʠ","ꝗ","ꝙ"]],["qp",["ȹ"]],["r",["ɍ","ɽ","ꝛ","ᵲ","ᶉ","ɼ","ɾ","ᵳ","ʀ","ɹ","ʁ","ꞧ","ꞃ"]],["s",["ᵴ","ᶊ","ʂ","ȿ","ꜱ","ʃ","ꞩ","ꞅ","ſ"]],["ss",["ß"]],["t",["ŧ","ⱦ","ƭ","ʈ","ᵵ","ƫ","ȶ","ᴛ","ꞇ"]],["th",["þ"]],["tz",["ꜩ"]],["u",["ʉ","ʊ","ᵾ","ᴜ","ᶙ"]],["ue",["ü","ᵫ"]],["v",["ʋ","ᶌ","ⱱ","ⱴ","ᴠ","ʌ","ꝟ"]],["vy",["ꝡ"]],["w",["ⱳ","ᴡ","ʍ"]],["x",["ᶍ"]],["y",["ɏ","ƴ","ʏ","ỿ"]],["z",["ƶ","ȥ","ⱬ","ᵶ","ᶎ","ʐ","ʑ","ɀ","ᴢ","ʒ","ƹ","ꝣ"]]]);class w{constructor(t,e,r,s,i,n){this.paddingLeft=void 0,this.paddingRight=void 0,this.paddingMiddle=void 0,this.replacements=void 0,this.treatCharacterAsSpace=void 0,this.allowCharacter=void 0,this.paddingLeft=t,this.paddingRight=e,this.paddingMiddle=r,this.replacements=s,this.treatCharacterAsSpace=i,this.allowCharacter=n}static createDefaultConfig(){const t=new Set(["_","-","–","/",",","	"]);return new w("$$","!","!$$",[N.Value],e=>t.has(e),e=>I.isAlphanumeric(e))}}class x{constructor(t,e,r,s){this.normalizerConfig=void 0,this.ngramComputerConfig=void 0,this.maxQueryLength=void 0,this.inequalityPenalty=void 0,this.normalizerConfig=t,this.ngramComputerConfig=e,this.maxQueryLength=r,this.inequalityPenalty=s}static createDefaultConfig(){const t=w.createDefaultConfig(),e=v.createDefaultConfig();return new x(t,e,150,.05)}}class K{static createSearcher(t){const e=M.createSearcher(t),r=M.createSearcher(t);let s=new A(t.maxQueryLength,e,r);return s=new q(s),s}static createDefaultSearcher(){const t=x.createDefaultConfig();return this.createSearcher(t)}}onmessage=a=>{const t=K.createDefaultSearcher(),e=new P;t.indexEntities(a.data.filter(r=>r.title&&r.url),r=>r.id,r=>[r.title,r.url]),t.save(e),postMessage(e.objects)}})();
